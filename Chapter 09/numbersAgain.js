/**
 * Numbers Again Exercise
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


const numbers = ["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4", "1e+12"];
const nan = ["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5", "." ];
const number = /^[+-]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?$/i;

for (let num of numbers) {
  if (!number.test(num)) {
    console.log(`Failed to match '${num}'`);
  }
}

for (let num of nan) {
  if (number.test(num)) {
    console.log(`Incorrectly accepted '${num}'`);
  }
}
