/*
 *
 * Exercise 02: Recursive Odds or Even
 *
 * Copyright (c) 2018  Joost Bremmer
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



// Define a recursive function function isEven corresponding to this
// discription:
// Zero is even
// One is odd
// For any other number N, its evenness is the same as N - 2

function isEven(n,isNegativeNumber) {
  if(n === 0) {
    return true;
  } else if (n === 1) {
    return false;
  } else if (isNegativeNumber === undefined) {
    isNegativeNumber = (n < 0);
  }

  if (isNegativeNumber) {
    return isEven(n+2, isNegativeNumber);
  } else {
    return isEven(n-2, isNegativeNumber);
  }
}

console.log(isEven(50));
// true
console.log(isEven(75));
// false
console.log(isEven(-1));
// false
