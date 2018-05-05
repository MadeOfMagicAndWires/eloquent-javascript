/*
 * Exercise 04: Deep Comparison
 *
 * Copyright (c) 2018 Joost Bremmer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

// Write a function deepEqual that takes two values and return true only if they
// are the same value or are objects with the same properties whose values are
// also equal when compared with a recursive call to deepEqual.

function deepEqual(a, b) {
  if(a === null && b === null) {
    return true;
  } else if (a === null && b !== null) {
    return false;
  } else if (typeof(a) !== typeof(b)) {
    return false;
  } else if (typeof(a) !== `object` && a === b) {
    return true;
  } else if (typeof(a) !== `object` && a !== b) {
    return false;
  } else if (typeof(a) === `object`) {
    for(let propa in a) {
      if(deepEqual(a[propa], b[propa])) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }
}

let obj = {here: {is: `an`}, object: 2};

console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: `an`}, object: 2}));
// → true
