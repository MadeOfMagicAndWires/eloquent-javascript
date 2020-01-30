#!/bin/node
/*
 * Directory Creation Exercise
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

// Add support for the MKCOL method (“make collection”),
// which should create a directory by calling mkdir from the fs module.

const fileServer = require("./fileServer");
const {F_OK, W_OK} = require("fs").constants;
const {stat, mkdir, access} = require("fs").promises;


fileServer.methods.MKCOL = async (req) => {
  let path = fileServer.urlPath(req.url);

  try {
    await access(process.cwd(), F_OK | W_OK);
    let stats = await stat(path);

    if(stats.isDirectory()) {
      return {status: 204};
    } else {
      return {status: 400, body: `${path} exists and is not a directory`};
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

fileServer.start("/tmp", 8000);
