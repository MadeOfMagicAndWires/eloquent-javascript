/**
  * Group Exercise
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

// Write a class called Group (since Set is already taken). Like Set, it has add,
// delete, and has methods. Its constructor creates an empty group, add adds a
// value to the group (but only if it isn’t already a member), delete removes its
// argument from the group (if it was a member), and has returns a Boolean value
// indicating whether its argument is a member of the group.


class Group {
  /**
   * Creates a new instance of the Group object
   *
   * @param {...object} items to add to a group
   * @return {Group} the new group instance
   *                 or undefined
   */
  constructor(...items) {
    this._items = new Array();

    if(items.length >= 0) {
      // add all parameters as to the group
      for(let item of items) {
        if(item === null || item === undefined || this.has(item)) {
          continue;
        }
        this._items.push(item);
      }
    }
  }

  /**
   * Adds a new item to the group if it isn't already a member
   *
   * @param {Object} item the item to add to the group
   * @return {Number} 0 if the item was added to the group
   *                  -1 if the item was already a member
   */
  add(item) {
    if(item !== undefined && !this.has(item) || item !== null && !this.has(item)) {
      this._items.push(item);
      return 0;
    }
    return -1;
  }

  /**
   * Removes an item from the Group if it is a member
   *
   * @param {Object} item the member to remove
   * @return {Number} 0 if the item was a member and is now removed
   *                  -1 if the item was not a member
   */
  del(item) {
    if(this.has(item)) {
      delete this._items[this._items.indexOf(item)];
      return 0;
    }
    return -1;
  }

  /**
   * Creates a new Group instance from an iterable object
   *
   * @param {Object} iterable an object that has the iteration method
   * @return {Group} a group instance with each iteratable item as a member
   *                 or 'undefined' if the paramter was not iterable
   */
  static from(iterable) {
    if(
      iterable === undefined ||
      iterable === null ||
      typeof iterable[Symbol.iterator] !== "function"
    ) {
      return undefined;
    }
    let group = new Group();

    for(let item of iterable) {
      group.add(item);
    }
    return group;
  }

  /**
   * Checks if an object is a member of the current group instance
   * @param {Object} item the object to check
   * @return {Boolean} true if the object is already a member
   *                   false if not
   */
  has(item) {
    return(this._items.includes(item));
  }

  /**
   * Returns an array containing all members of this instance
   * @return {Array} all the members of a Group as an array
   */
  get values() {
    return [...this._items];
  }

}

export {Group};

/** Test Group class */

// console.log("***" , "Testing Group class", "***");
// let group = new Group(10, 20, 30);
//
// console.log(group.values);
// // → [10 , 20 ,30]
//
// group = Group.from([10, 20]);
// console.log(group.has(10));
// // → true
// console.log(group.has(30));
// // → false
// console.log(group.add(10));
// console.log(group.values);
// // → -1
// // [10 , 20]
// group.del(10);
// console.log(group.has(10));
// → false
