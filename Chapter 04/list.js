/*
 * Exercise 03: A List
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



// Write a function arrayToList that builds up a data structure like the
// previous one when given "[1,2,3]" as an argument.
function arrayToList(arr) {
  let curr = null;
  let root = curr;

  for(let each of arr) {
    let buf = {
      value: each,
      next: null
    };

    // init first node, we need this because else we can't read curr.next otherwise.
    if(root === null) {
      curr = buf;
      root = curr;
      continue;
    }

    while(curr.next !== null) {
      curr = curr.next;
    }
    curr.next = buf;
  }
  return root;
}

// Write a 'listTiArray' function that produces an array from a list.
function listToArray(list) {
  let curr = list;
  let arr = [];

  while(curr.next !== null) {
    if(curr.value) { arr.push(curr.value); }
    curr = curr.next;
  }
  return arr;
}

// Also write the helper function 'prepend' which takes an element and a list an
// creates a new list that adds the element to the front of the input list.
function prepend(element, list) {
  return {value: element, next: list};
}

// write the helper function 'nth' which tales a list and a number an returns
// the element at the given position in the list.

function nth(list,n) {
  let curr = list;

  for(let i=0;i<n;i++) {
    if (curr.next !== null) {
      curr = curr.next;

    } else {
      return undefined;
    }
  }
  return curr.value;

}

// If you haven't already also write a recursive version of nth
function recursiveNth(list, n) {
  if(n === 0) {
    return list.value;
  } else if(list.next) {
    recursiveNth(list.next, n-1);
  } else { return undefined; }

}

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20
console.log(nth(arrayToList([10, 20, 30]), 3));
// → undefined
console.log(recursiveNth(arrayToList([10, 20, 30]), 0));
