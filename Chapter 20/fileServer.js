#!/bin/node
/**
 * File Server Example from Eloquent Javascript 3rd ed. Chapter 20
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

// Imports
const {createServer} = require("http");
const {parse, pathToFileURL, fileURLToPath} = require("url");
const {resolve, sep} = require("path");
const {createReadStream, createWriteStream} = require("fs");
const {access, stat, readdir, rmdir, unlink, mkdir, rename} = require("fs").promises;
const {F_OK, R_OK, W_OK} = require("fs").constants;
const events = require("events");
const mime = require("mime");

let baseDirectory = process.cwd();
const methods = Object.create(null);

async function notAllowed(request) {
  return {
    status: 405,
    statusMessage: `Method ${request.method} not allowed.`
  };
}




function urlPath(url) {
  let {pathname} = parse(url);
  let path = resolve(decodeURIComponent(pathname).slice(1));

  if (path !== baseDirectory &&
      !path.startsWith(baseDirectory + sep)) {
    throw {status: 403};
  }
  return path;
}

// update GET method to check for read permission as well
methods.GET = async function(request) {
  async function listFiles(path, params) {
    let children = [];
    const ls = await readdir(path, {withFileTypes: true});

    for(let dirent of ls) {
      // get relative path
      let child = path.replace(baseDirectory, "");

      // massage path to relative path without starting / for recursive mode
      child = (child === "") ? child + dirent.name : child.slice(1) + sep + dirent.name;


      if(dirent.isDirectory()) {
        children.push(child + sep);

        // if we're in recursive mode add all child elements
        if(params && params.has("mode") && params.get("mode") === "recursive") {
          children = children.concat(await listFiles(path + sep + dirent.name, params));
        }
      } else {
        children.push(child);
      }
    }
    return children;
  }


  let urlParts = request.url.split("?");
  let path = urlPath(urlParts[0]);
  let params = new URLSearchParams(urlParts[1]);
  let stats;


  try {
    await access(path, F_OK | R_OK);
    stats = await stat(path);
  } catch (error) {
    if(error.code === "ENOENT") {
      return {status: 404};
    } else if(error.code === "EACCES") {
      return {status: 403};
    } else {
      throw error;
    }
  }
  if (stats.isDirectory()) {
    // add a seperator to child directories
    // to differentiate them from regular files
    return {
      status: 200,
      body: (await listFiles(path, params)).join("\n")
    };
  } else {
    return {body: createReadStream(path),
      type: mime.getType(path)};
  }
};

methods.DELETE = async function(request) {
  let path = urlPath(request.url);
  let stats;

  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    } else {
      return {status: 204};
    }
  }
  if (stats.isDirectory()) {
    try {
      await rmdir(path, {"recursive": false});
    } catch(e) {
      console.error(e.toString());
      if(e.code === "ENOTEMPTY") {
        return {status: 304, statusMessage: "Directory is not empty!"};
      }
      throw e;
    }
  } else {
    await unlink(path);
  }
  return {status: 204};
};

function pipeStream(from, to) {
  return new Promise((res, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", res);
    from.pipe(to);
  });
}

// See also directoryCreation.js
methods.MKCOL = async (req) => {
  let path = urlPath(req.url);

  try {
    await access(process.cwd(), F_OK | W_OK);
    let stats = await stat(path);

    if(stats.isDirectory()) {
      return {status: 204};
    } else {
      return {status: 400, statusMessage: `${path} exists and is not a directory`};
    }
  } catch(e) {
    switch(e.code) {
      case "ENOENT":
        // path does not exist. create it, return success
        await mkdir(path);
        return {status: 204};
      case "EACCES":
        // no write access to parent directory, return forbidden
        return {status: 403};
      default:
        // something unexpected happened!
        throw e;
    }
  }
};


methods.MOVE = async function(req) {
  let oldPath = urlPath(req.url);
  let reqBody = "";
  let newPath = null;
  let status = 301;

  try {
    await access(oldPath, F_OK);
    await access(process.cwd(), F_OK | W_OK);

    req.setEncoding("utf8");
    req.on("data", (data) => {
      reqBody += data.toString();
    });

    req.on("end", async () => {
      try {
        let data = await JSON.parse(reqBody);

        if(data && data.newPath) {
          newPath = urlPath(data.newPath);
          access(newPath, W_OK).then(async () => {
            await rename(oldPath, newPath);
          }).catch( async (e) => {
            if(e.code === "ENOENT") {
              await rename(oldPath, newPath);
            }
          });
        } else {
          throw new Error("Missing required Request parameter 'newPath'");
        }
      } catch(e) {
        console.error(`Got error ${e.name}: ${e.message}`);
        status = 400;
      }
    });

    // wait for end event to fire, check for file at newPath and return success
    await events.once(req, "end");
    return {status};

  } catch(e) {
    // error occured in checking access of file, pwd, or newPath
    // cannot resolve request!
    switch(e.code) {
      case "ENOENT":
        // oldPath does not exist return File Not Found
        return {status: 404};
      case "EACCES":
        // no write access at either parent directory or newPath,
        // return "Forbidden"
        return {status: 403};
      default:
        // something else went wrong! Throw!
        throw e;
    }
  }
};

methods.POST = async function(request) {
  let path = urlPath(request.url);

  try {
    await access(path, F_OK | W_OK);
  } catch(e) {
    if(e.code === "EACCES") {
      return {status: 403};
    } else if (e.code !== "ENOENT") {
      throw e;
    }
  }

  await pipeStream(request, createWriteStream(path));
  return {status: 204};
};

methods.PUT = methods.POST;

async function start(path=null, port=8000) {
  if(path) {
    try {
      path = pathToFileURL(path);
      let stats = await stat(path);

      if(stats.isDirectory()) {
        process.chdir(fileURLToPath(path));
        baseDirectory = process.cwd();
      } else {
        console.error(`${path} is not a directory`);
      }
    } catch(e) {
      if(e.code === "ENOENT") {
        console.error(`Directory ${path} does not exist`);
      }
    }
  }

  console.log(`Starting server at ${path} on port ${port}`);

  createServer((request, response) => {
    let handler = methods[request.method] || notAllowed;

    console.log(`Got ${request.method} request for ${request.url}`);
    handler(request)
      .then(({body, status = 200, type = "text/plain", statusMessage = null}) => {
        response.writeHead(
          status,
          (statusMessage) ? statusMessage : undefined,
          {"Content-Type": type}
        );
        if (body && body.pipe) {
          body.pipe(response);
        } else {
          response.end(body);
        }
      })
      .catch(error => {
        if (error.status != null) {
          return error;
        }
        console.log(`returning ${error}`);
        return {body: error.message, status: 500};
      });
  }).listen(port);

}

if(typeof module === "object" && module.exports) {
  module.exports = {methods, start, urlPath};
}
