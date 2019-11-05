/**
  * Persisten Group Exercise
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


// Write a new class PGroup, similar to the Group class from Chapter 6,
// which stores a set of values. Like Group, it has add, delete, and has methods.

// Its add method, however, should return a new PGroup instance
// with the given member added and leave the old one unchanged.
// Similarly, delete creates a new instance without a given member.

import {Group} from "../Chapter 06/Group.mjs";

class PGroup extends Group {

  constructor(...items) {
    super(...items);
    // protect group items from changes
    Object.freeze(this._items);
  }

  add(item) {
    if(item !== undefined || item !== null) {
      if(!this.has(item)) {
        return new PGroup(...this._items, item);
      }
      return null;
    }
    return null;
  }

  del(item) {
    if(this.has(item)) {
      return new PGroup(...this._items.filter(val => val !== item));
    }
  }
}

PGroup.empty = new PGroup();

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.del("a");

console.log("***" , "Testing PGroup class", "***");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
