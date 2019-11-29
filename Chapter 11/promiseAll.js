/**
 * Promise All Exercise
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


// Implement something like Promise.all yourself as a regular function called
// promiseAll.


// I initially tried to use the for index as promise resolution indicator but of
// i is of course already assigned before the promise was resolved and so the
// if clause would often return true too early.
// Took the pending fix from the exercise solution.


function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    let results = [];
    let pending = promises.length;

    if(pending > 0) {
      for(let i=promises.length-1;i>=0;i--) {
        /* eslint-disable-next-line no-loop-func */
        promises[(promises.length-1)-i].then(value => {
          results[(promises.length-1)-i] = value;
          pending--;
          if(pending === 0) {
            resolve(results);
          }
        }, reject);
      }
    } else {
      resolve(results);
    }
  });
}

// Test code.
promiseAll([]).then(array => {
  console.log("This should be []:", array);
});
function soon(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
promiseAll([soon(1), soon(2), soon(3)]).then(array => {
  console.log("This should be [1, 2, 3]:", array);
});
promiseAll([soon(1), Promise.reject("X"), soon(3)])
  /* eslint-disable-next-line no-unused-vars */
  .then(_ => {
    console.error("We should not get here");
  })
  .catch(error => {
    if (error !== "X") {
      console.error("Unexpected failure:", error);
    }
  });
