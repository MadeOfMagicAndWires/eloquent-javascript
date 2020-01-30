#!/bin/node
/*
 * "Grep" Like Search Tool
 * Copyright © 2020 Joost Bremmer
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

// import relevant modules
const events = require("events");
const {stat , readdir, access} = require("fs").promises;
const fs = require("fs");
const readline = require("readline");
const url = require("url");
const systemSeperator = require("path").sep;

/**
 * Returns all readible files in a given list of paths
 *
 * @param {Array.String} paths=[] The list of paths to check for a readible file or directory
 * @returns {Array.String} A list of existing files found at the paths given
 */
async function getFiles(paths = []) {
  let files = [];

  for(let path of paths) {
    try {
      if(!(path instanceof URL)) {
        path = url.pathToFileURL(path);
      }

      const stats = await stat(path);

      // if path is directory, queue its children files to be added
      // else if the file is readible push it to the stack
      if(stats.isDirectory()) {
        const children = await readdir(path);

        for(let file of children) {
          files = files.concat(await getFiles([new URL(encodeURIComponent(file), path.toString()+systemSeperator)]));
        }
      } else {
        await access(path, fs.constants.R_OK);
        files.push(path);
      }
    } catch(e) {
      if(e.code === "ENOENT") { // file does not exist
        continue;
      } else if(e.code === "EACCES") { // not the right access
        console.error(`${url.fileURLToPath(path)}: Permission denied`);
        continue;
      } else {
        console.error(e.trace);
        continue;
      }
    }
  }
  return files;
}

/**
 * Adds highlight colours to match using terminal colors
 *
 * @param {String} str the string to check for matches
 * @param {RegExp} pattern the regex pattern describing what to look for
 * @returns {String} the string containing red terminal colours surrounding each match
 */
function highlightMatch(str, pattern) {
  // regex is not global, only highlight the first match
  if(!pattern.flags || !pattern.flags.includes("g")) {
    return str.replace(pattern, $1 => "\x1b[31m" + $1 + "\x1b[0m");
  }

  // regex is global, highlight every match
  pattern.lastIndex = 0;
  let match = null;
  let ret = str.slice(0);

  while((match=pattern.exec(str)) !== null) {
    ret = ret.replace(match[0], $1 => "\x1b[31m" + $1 + "\x1b[0m");

    if(match.index === pattern.lastIndex) {
      pattern.lastIndex++;
    }
  }
  return ret;
}


/**
 * Prints all lines containing a given pattern to the console
 *
 * @param {RegexExp} regex=RegexExp() Regex Pattern describing what to look for
 * @param {Array.String} paths=[] the list of files to check for matches
 * @returns {undefined}
 */
async function grep(regex = RegExp(), paths = []) {
  let ret = 1;

  // no files to check, exit with 0
  if(paths.length === 0) {
    return 0;
  }

  // cast regex as RegExp if it is not one already
  if(typeof regex === "string") {
    const flags = regex.replace(/.*\/([gmisuy]*)$/, "$1");
    const pattern = regex.replace(new RegExp(`^/(.*?)/${flags}$`), "$1");

    regex = new RegExp(pattern, flags);
  }

  // check each file line by line for any matches
  // print lines that match to the console
  for(let file of paths) {
    try {
      const lines = readline.createInterface({input: fs.createReadStream(file)});

      let lineNo = 0;

      /* eslint-disable-next-line no-loop-func */
      lines.on("line", (line) => {
        if(regex.test(line)) {
          const baseDir = process.cwd();
          const fileName = url.fileURLToPath(file);

          console.log(`${(fileName.startsWith(baseDir)) ? fileName.replace(baseDir, ".") : fileName} ${lineNo}: ${highlightMatch(line, regex)}`);
          lineNo++;
          ret = 0;
        }
      });

      await events.once(lines, "close");
    } catch (err) {
      console.error(err);
      if(err.code === "EACCES") {
        console.error(`${file}: Permission denied`);
        continue;
      }
    }
  }
  return ret;
}


/**
 * Runs the program with command line parameters
 *
 * @returns {undefined}
 */
async function main() {
  process.exit(await grep(process.argv.splice(2,1)[0], await getFiles(process.argv.splice(2))));
}

main();

