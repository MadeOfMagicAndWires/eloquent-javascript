/**
  * Retry Exercise
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

// 'use strict';

/**
 * Represents an error that occured due to faulty multipplication
 * @class
 */
class MultiplicatorUnitFailure extends Error {}

/**
 * Multiplies two numbers in 20% of cases and raises an exception the other 80%
 * @param {Number} a - first number to multiply
 * @param {Number} b - second number to multply the first one with
 * @return {Number} the multipplication result of a*b
 * @throws {MultiplicatorUnitFailure} if the method failed
 */
function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

/**
 * keeps calling primitiveMultiply until it succeeds
 * @param {Number} a - first number to multiply
 * @param {Number} b - second number to multply the first one with
 * @return {Number} the multipplication result of a*b
 */
function reliableMultiply(a, b) {
  for(let i=0;;i++) {
    console.log(`Attempt ${i}`);
    try {
      return primitiveMultiply(a,b);
    } catch(e) {
      // known error, just log it
      if(e instanceof MultiplicatorUnitFailure) {
        // console.warn(e.message);
      } else {
        // otherwise something really went wrong! show trace
        throw e;
      }
    }
  }
}

console.log(reliableMultiply(8, 8));
// → 64
