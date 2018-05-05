/*
 * Exercise 02: Mother-Child Age Difference (ＡＥＳＴＨＥＴＩＣ)
 *
 * Copyright (c) 2018 Joost Bremmer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
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

// Load ancestry JSON data.
let ANCESTRY_FILE;

if (typeof module !== `undefined`) {
  ANCESTRY_FILE = require(`./data/ancestry.js`);
}
let ancestry = JSON.parse(ANCESTRY_FILE);


// Using the example data set from this chapter, compute the average age
// difference between mothers and children (the age of the mother when the child
// is born). You can use the 'average' function defined earlier in this chapter.

let byName = {};

for(let person of ancestry) {
  byName[person.name] = person;
}

function average(array) {
  return (array.reduce((a,b) => a+b) / array.length);
}


console.log(
  average(ancestry.filter(
    (person) => byName[person.mother] !== null).map(
    (person) => person.born - byName[person.mother].born)
  ));
