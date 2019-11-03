/**
  * Iterable Group Exercise
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

// Make the Group class from the previous exercise iterable. Refer to the section
// about the iterator interface earlier in the chapter if you aren’t clear on the
// exact form of the interface anymore.

import {Group} from "./Group.mjs";


class GroupIterator {

  /**
   * Creates a new instance of GroupIterator
   * @param {It3erableGroup} group the group instance to iterate
   */
  constructor(group) {
    if(group instanceof Group) {
      this._group = group;
      this.i = 0;
    } else {
      return undefined;
    }
  }

  next() {
    if(this.i === this._group.length) {
      return {"done": true};
    } else {
      let next = {"value": this._group._items[this.i], "done": false};

      this.i++;
      return next;
    }
  }
}

class IterableGroup extends Group {

  constructor(...items) {
    super(...items);
  }

  valueAt(index) {
    return this._items[index];
  }

  /**
   * Returns the number of members
   * @return {Number} the total number of members in this instance
   */
  get length() {
    return this._items.length;
  }

  static from(iterable) {
    if(
      iterable === undefined ||
      iterable === null ||
      typeof iterable[Symbol.iterator] !== "function"
    ) {
      return undefined;
    }
    let group = new IterableGroup();

    for(let item of iterable) {
      group.add(item);
    }
    return group;
  }

  /**
   * Return a new Iterator instance
   *
   * @return {GroupIterator} iterator of the current group instance
   */
  [Symbol.iterator]() {
    return new GroupIterator(this);
  }
}

console.log("***", "Testing IterableGroup class", "***");
for (let value of IterableGroup.from(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c
