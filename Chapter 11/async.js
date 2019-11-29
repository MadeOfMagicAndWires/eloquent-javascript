/**
 * Crow Tech Asynchronous Functions
 * Copyright © 2019 Marijn Haverbeke
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


var defineRequestType = require("./crow-tech").defineRequestType;

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});

function storage(nest, name) {
  return new Promise(resolve => {
    nest.readStorage(name, result => resolve(result));
  });
}

var Timeout = class Timeout extends Error {};

function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;

    function attempt(n) {
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) { reject(failed); } else { resolve(value); }
      });
      setTimeout(() => {
        if (done) { return; } else if (n < 3) { attempt(n + 1); } else { reject(new Timeout("Timed out")); }
      }, 250);
    }
    attempt(1);
  });
}

function requestType(name, handler) {
  defineRequestType(name, (nest, content, source,
    callback) => {
    try {
      Promise.resolve(handler(nest, content, source))
        .then(response => callback(null, response),
          failure => callback(failure));
    } catch (exception) {
      callback(exception);
    }
  });
}

requestType("ping", () => "pong");

// eslint-disable-next-line no-unused-vars
function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
    return request(nest, neighbor, "ping")
      .then(() => true, () => false);
  });

  return Promise.all(requests).then(result => {
    return nest.neighbors.filter((_, i) => result[i]);
  });
}

var everywhere = require("./crow-tech").everywhere;

everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of nest.neighbors) {
    if (neighbor === exceptFor) { continue; }
    request(nest, neighbor, "gossip", message);
  }
}

function broadcastConnections(nest, name, exceptFor = null) {
  for (let neighbor of nest.neighbors) {
    if (neighbor === exceptFor) { continue; }
    request(nest, neighbor, "connections", {
      name,
      neighbors: nest.state.connections.get(name)
    });
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) { return; }
  console.log(`${nest.name} received gossip '${
    message}' from ${source}`);
  sendGossip(nest, message, source);
});

requestType("connections", (nest, {name, neighbors},
  source) => {
  let connections = nest.state.connections;

  if (JSON.stringify(connections.get(name)) ===
      JSON.stringify(neighbors)) { return; }
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});


everywhere(nest => {
  nest.state.connections = new Map;
  nest.state.connections.set(nest.name, nest.neighbors);
  broadcastConnections(nest, nest.name);
});

function findRoute(from, to, connections) {
  let work = [{at: from, via: null}];

  for (let i = 0; i < work.length; i++) {
    let {at, via} = work[i];

    for (let next of connections.get(at) || []) {
      if (next === to) { return via; }
      if (!work.some(w => w.at === next)) {
        work.push({at: next, via: via || next});
      }
    }
  }
  return null;
}

function routeRequest(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, target,
      nest.state.connections);

    if (!via) { throw new Error(`No route to ${target}`); }
    return request(nest, via, "route",
      {target, type, content});
  }
}

requestType("route", (nest, {target, type, content}) => {
  return routeRequest(nest, target, type, content);
});

requestType("storage", (nest, name) => storage(nest, name));

function network(nest) {
  return Array.from(nest.state.connections.keys());
}

function findInRemoteStorage(nest, name) {
  let sources = network(nest).filter(n => n !== nest.name);

  function next() {
    if (sources.length === 0) {
      return Promise.reject(new Error("Not found"));
    } else {
      let source = sources[Math.floor(Math.random() *
                                      sources.length)];

      sources = sources.filter(n => n !== source);
      return routeRequest(nest, source, "storage", name)
        .then(value => value != null ? value : next(),
          next);
    }
  }
  return next();
}


/* eslint-disable-next-line no-unused-vars */
function findInStorage(nest, name) {
  return storage(nest, name).then(found => {
    if (found != null) { return found; } else { return findInRemoteStorage(nest, name); }
  });
}


/* eslint-disable-next-line no-unused-vars */
var Group = class Group {
  constructor() { this.members = []; }
  add(m) { this.members.add(m); }
};

function anyStorage(nest, source, name) {
  if (source === nest.name) { return storage(nest, name); } else { return routeRequest(nest, source, "storage", name); }
}

/* eslint-disable-next-line no-unused-vars */
async function chicks(nest, year) {
  let list = "";

  await Promise.all(network(nest).map(async name => {
    let chickNo = await anyStorage(nest, name, `chicks in ${year}`);

    list += `${name}: ${chickNo}`;
  }));
  return list;
}

exports.anyStorage = anyStorage;


/* eslint-disable no-undef */
if (typeof __sandbox !== "undefined") {
  __sandbox.handleDeps = false;
  __sandbox.notify.onLoad = () => {
    // Kludge to make sure some functions are delayed until the
    // nodes have been running for 500ms, to give them a chance to
    // propagate network information.
    let waitFor = Date.now() + 500;

    function wrapWaiting(f) {
      return function(...args) {
        let wait = waitFor - Date.now();

        if (wait <= 0) { return f(...args); }
        return new Promise(ok => setTimeout(ok, wait)).then(() => f(...args));
      };
    }
    for (let n of ["routeRequest", "findInStorage", "chicks"]) { window[n] = wrapWaiting(window[n]); }
  };
}
/* eslint-enable no-undef */

if (typeof window !== "undefined") {
  window.require = name => {
    if (name !== "./async") { throw new Error("Crow nests can only require \"./crow-tech\""); }
    return exports;
  };
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = exports;
}
