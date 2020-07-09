/*
 * Exercise 03: Bean Counting
 *
 * Copyright (c)  Joost Bremmer
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



// Write a function countBs that takes a string as its only argument and returns
// a number that indicates how many uppercase "B" characters are in the string.
//
// Next write a function called countChar that behaves like countBs, except it
// takes a second argument that indicates the character that is to be counted.

function countChar(str, charMatch) {
  let results = 0;

  for(let i=0;i<str.length;i++) {
    if(str.charAt(i) === charMatch) { results++; }
  }
  return results;
}

function countBs(str) {
  return countChar(str, "B");
}

console.log(countBs("BBC"));
// 2
console.log(countChar("kakkerlak", "k"));
// 4
