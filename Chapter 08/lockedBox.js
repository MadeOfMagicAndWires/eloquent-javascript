/**
  * Locked Box Exercise
  * Copyright © 2019 Joost Bremmer
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

// Write a function called withBoxUnlocked that:
// 1. takes a function value as argument,
// 2. unlocks the box,
// 3. runs the function,
// 4. and then ensures that the box is locked again before returning,
//    regardless of whether the argument function returned normally
//    or threw an exception.

// 'use strict';

const box = {
  _locked: true,
  unlock() { this._locked = false; },
  lock() { this._locked = true; },
  _content: [],

  get content() {
    if (this.locked) { throw new Error("Locked!"); }
    return this._content;
  },

  get locked() {
    return this._locked;
  },

  set locked(value) {
    return null;
  }
};

function withBoxUnlocked(body) {
  let result;

  try {
    result = body();
  } catch(e) {
    if(e.message === "Locked!") {
      box.unlock();
      result = body();
      box.lock();
      return result;
    }
    throw e;
  } finally {
    if(box.locked === false) {
      box.lock();
    }
  }
}

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

withBoxUnlocked(() => {
  console.log( `lockbox contains: ${box.content}`);
});

withBoxUnlocked(() => {
  console.log(`lock box is: ${box.locked ? "locked" : "unlocked" }`);
  console.log(`Trying to modify locked value to:  ${!box.locked ? "locked" : "unlocked" }`);
  box.locked = !box.locked;
  console.log(`lock box is ${box.locked ? "locked" : "unlocked" }`);
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised: " + e);
}
console.log(box.locked);
// → true
