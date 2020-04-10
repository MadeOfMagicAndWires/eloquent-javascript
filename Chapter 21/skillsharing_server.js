#!/bin/env node
/*
 * Skill Sharing Project Server
 * Copyright © 2020 Marijn Haverbeke
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


const {createServer} = require("http");
const Router = require("./router");
const ecstatic = require("ecstatic");
const {createReadStream} = require("fs");
const {pathToFileURL} = require("url");
const fs = require("fs").promises;

const router = new Router();
const defaultHeaders = {"Content-Type": "text/plain"};

function readStream(stream) {
  return new Promise((resolve, reject) => {
    let data = "";

    stream.on("error", reject);
    stream.on("data", chunk => (data += chunk.toString()));
    stream.on("end", () => resolve(data));
  });
}


/**
 * Creates a talks object from JSON data in a file
 *
 * @param {string} filename="talks.json" The path to the file to read
 * @returns {Object} Object containing all talks saved in the file;
 *                   or an empty object
 */
async function readTalksFromFile(filename="talks.json") {
  try {
    let path = await fs.realpath(filename);
    let talksStream = await createReadStream(path, {encoding: "utf-8", flag: "r"});
    let talksContainer = Object.create(null);

    // wrap into null object to ensure x in y syntax works correctly
    return Object.assign(talksContainer,
      JSON.parse(await readStream(talksStream))
    );
  } catch(e) {
    if(e instanceof SyntaxError) {
      console.log(`Mismatched JSON object found in '${filename}'`);
      return Object.create(null);
    }
    switch(e.code) {
      case "ENOENT":
        // console.error(`File '${filename}' does not exist!`);
        return Object.create(null);
      case "EACCES":
        console.error(`Could not open '${filename}': ${e.message}`);
        return Object.create(null);
      default:
        throw e;
    }
  }
}

/**
 * Saves all talks in memory to an external file
 *
 * @param {string} filename="talks.json" the path to the file on disk that
 *                                       the data will be saved to.
 *                                       Will create a new file where it does
 *                                       not exist, and will overwrite any data
 *                                       that is already in the file
 * @param {string|Object} data the talks data to save to disk in JSON format
 * @returns {Promise} Promise that resolves once the data has been saved successfully
 */
function writeTalkToFile(filename="talks.json", data) {
  return new Promise((res,rej) => {
    let path;

    if(!(filename instanceof URL) || typeof filename === "string") {
      // get real path
      path = pathToFileURL(filename);
    } else {
      path = filename;
    }

    // cast data as string if it is not one already
    if(!(data instanceof String) && typeof data !== "string") {
      data = JSON.stringify(
        (data !== Object.create(null)) ? data : {},
        null,
        2
      );
    }

    // write data to file, then resolve
    fs.writeFile(path, data)
      .then(res).catch(e => {
        console.error(e);
        rej(e);
      });
  });
}

let SkillShareServer = class SkillShareServer {
  constructor(talks="talks.json") {
    console.log(`talks: ${talks}`);
    if(talks && talks instanceof String || typeof talks === "string") {
      this.talksPath = talks;
      this.talks = Object.create(null);
    }
    this.version = 0;
    this.waiting = [];
    this.running = false;

    this.init(this.talksPath);
  }

  async init(filename="talks.json") {
    let fileServer = ecstatic({root: "./public"});

    if(filename) {
      this.talks = await readTalksFromFile(filename);
    }

    this.server = createServer(
      (request, response) => {
        console.log(`Got ${request.method} request for ${request.url}`);
        let resolved = router.resolve(this, request);

        if (resolved) {
          resolved.catch(error => {
            if (error.status != null) { return error; }
            return {body: String(error), status: 500};
          }).then(
            ({body, status = 200, headers = defaultHeaders}) => {
              response.writeHead(status, headers);
              response.end(body);
            });
        } else {
          fileServer(request, response);
        }
      });

    this.running = true;
  }


  async start(port) {
    if(!this.running) {
      await this.init(this.talksPath);
    }
    await this.server.listen(port);
    return this.server.listening;
  }

  stop() {
    this.server.close();
    if(this.talksPath) {
      writeTalkToFile(this.talksPath, this.talks);
    } else {
      writeTalkToFile("talks.json", this.talks);
    }
    return !this.server.listening;
  }

  get listening() {
    if(this.running) {
      return this.server.listening;
    }
    return false;
  }
};

const talkPath = /^\/talks\/([^/]+)$/;

router.add("GET", talkPath,
  async (server, title) => {
    if (title in server.talks) {
      return {body: JSON.stringify(server.talks[title]),
        headers: {"Content-Type": "application/json"}};
    } else {
      return {status: 404, body: `No talk '${title}' found`};
    }
  });

router.add("DELETE", talkPath, async (server, title) => {
  if (title in server.talks) {
    delete server.talks[title];
    server.updated();
  }
  return {status: 204};
});


router.add("PUT", talkPath,
  async (server, title, request) => {
    let requestBody = await readStream(request);
    let talk;

    try {
      talk = JSON.parse(requestBody);
    } catch (_) {
      return {status: 400, body: "Invalid JSON"};
    }

    if (!talk ||
      typeof talk.presenter !== "string" ||
      typeof talk.summary !== "string") {
      return {status: 400, body: "Bad talk data"};
    }
    server.talks[title] = {title,
      presenter: talk.presenter,
      summary: talk.summary,
      comments: []};
    server.updated();
    return {status: 204};
  });

router.add("POST", /^\/talks\/([^/]+)\/comments$/,
  async (server, title, request) => {
    let requestBody = await readStream(request);
    let comment;

    try { comment = JSON.parse(requestBody); } catch (_) { return {status: 400, body: "Invalid JSON"}; }

    if (!comment ||
      typeof comment.author !== "string" ||
      typeof comment.message !== "string") {
      return {status: 400, body: "Bad comment data"};
    } else if (title in server.talks) {
      server.talks[title].comments.push(comment);
      server.updated();
      return {status: 204};
    } else {
      return {status: 404, body: `No talk '${title}' found`};
    }
  });

SkillShareServer.prototype.talkResponse = function() {
  let talks = [];

  for (let title of Object.keys(this.talks)) {
    talks.push(this.talks[title]);
  }

  return {
    body: JSON.stringify(talks),
    headers: {"Content-Type": "application/json",
      "ETag": `"${this.version}"`}
  };
};

router.add("GET", /^\/talks$/, async (server, request) => {
  let tag = (/"(.*)"/).exec(request.headers["if-none-match"]);
  let wait = (/\bwait=(\d+)/).exec(request.headers.prefer);

  if (!tag || parseInt(tag[1], 10) !== server.version) {
    return server.talkResponse();
  } else if (!wait) {
    return {status: 304};
  } else {
    return server.waitForChanges(parseInt(wait[1], 10));
  }
});

SkillShareServer.prototype.waitForChanges = function(time) {
  return new Promise(resolve => {
    this.waiting.push(resolve);
    setTimeout(() => {
      if (!this.waiting.includes(resolve)) {
        return;
      }
      this.waiting = this.waiting.filter(r => r !== resolve);
      resolve({status: 304});
    }, time * 1000);
  });
};

SkillShareServer.prototype.updated = async function() {
  this.version++;
  let response = this.talkResponse();

  this.waiting.forEach(resolve => resolve(response));
  this.waiting = [];

  let filename = (this.talksPath) ?
    pathToFileURL(this.talksPath) : pathToFileURL("talks.json");

  // write changes in memory to disk every 10 changes,
  // minimal data might get lost, but slightly reduces disk tear
  if(this.version === 1 || (this.version % 10) === 0) {
    try {
      await writeTalkToFile(
        filename,
        JSON.stringify(
          (this.talks !== Object.create(null)) ? this.talks : {},
          null,
          2)
      );
    } catch(e) {
      if(e.code === "EACCES") {
        console.error(`Cannot write into file ${filename}: ${e.message}`);
        return;
      } else {
        throw e;
      }
    }
  }
};


/**
 * Runs at the start of the program; initiates the server
 *
 * @param {string[]} argv command line arguments
 * @returns {undefined}
 */
async function main(argv) {
  let cmdParams = {port: 8000, talksF: undefined};
  let server = null;

  // parses flags and creates a server instance with the data passed along,
  // if any
  async function handleFlag(argument, index) {
    switch(argument) {
      case "-p":
      case "--ports":
        cmdParams.port = !isNaN(argv[index+1]) && parseInt(argv.splice(index+1,1)[0], 10);
        console.log(`Setting port: ${cmdParams.port}`);
        break;
      case "-f":
      case "--file":
        cmdParams.talksF = argv.splice(index+1,1).shift();
        console.log(`Setting talks file: ${cmdParams.talksF}`);
        break;
      default:
        return;
    }
  }

  // saves changes to disk then exits
  function saveChangesOnExit() {
    console.log("Saving changes to file");
    if(server) {
      writeTalkToFile(server.talksPath,
        JSON.stringify(
          (server.talks !== Object.create(null)) ? server.talks : {},
          null,
          2
        )
      ).then(() => {
        console.log("Goodbye.");
        process.exit(1);
      });
    }
  }

  // remove "node ./script arguements"
  argv = (argv[0] === "node") ? argv.splice(2) : argv.splice(1);


  for(let arg of argv) {
    switch(arg[0]) {
      case "-":
        handleFlag(arg, argv.indexOf(arg), cmdParams);
        break;
      default:
        break;
    }
  }

  console.log("Starting server...");
  server = await new SkillShareServer(cmdParams.talksF);

  server.start(cmdParams.port).then(running => {
    if(running) {
      console.log("Server started");
    }
  });


  // saves changes to disk when this process is
  // interrupted or terminated
  process.on("SIGHUP", saveChangesOnExit);
  process.on("SIGTERM", saveChangesOnExit);
  process.on("SIGINT", saveChangesOnExit);
  process.on("SIGABRT", saveChangesOnExit);
}

// Run main function if this script is called directly
if(require !== undefined && require.main === module) {
  main(process.argv);
}
