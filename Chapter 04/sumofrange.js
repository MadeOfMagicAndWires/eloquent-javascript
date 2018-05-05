/*
 * Exercise 01: Sum of a Range
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

// Write a range function that takes two arguments, 'start' and 'end', and returns
// an array containing all the numbers from 'start' up to (and including) 'end'.

function range(start, end, step) {

  let arr = [];

  step = (arguments.length >= 3) ? step : 1;

  if(step<0){
    for(;start>=end;start+=step) {
      arr.push(start);
    }
  } else {
    for(;start<=end;start+=step) {
      arr.push(start);
    }
  }
  return arr;
}

// Next write a sum function that takes an array of numbers and returns the sum
// of these numbers.

function sum(numbers) {
  let result = 0;

  for(let num of numbers) {
    result += Number(num);
  }
  return result;
}

// Run the previous program and see whether it does indeed return 55.
console.log(range(1,10));
console.log(range(5,2,-1));
console.log(sum(range(1,10)));
