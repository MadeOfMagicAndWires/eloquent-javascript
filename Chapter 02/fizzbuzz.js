/*
 *
 * Exercise 02
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

// Write a program that uses console.log to print all the numbers from 1 to 100
// with 2 exceptions. For the numbers divisable by 3, print "Fizz" instead of
// the number, and for numbers divisable by 5 (and not 3) print "Buzz" instead.

for(let i=1;i<=100;i++){
  if ((i % 3) === 0 && (i % 5) !== 0 && i !== 0) {
    console.log("Fizz");
  } else if ((i % 5) === 0 && (i % 3) !== 0 && i !== 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}

// When you have that working modif your program to print "FizzBuzz" for numbers
// that are divisable by both 3 and 5.

for(let i=1;i<=100;i++) {
  if ((i % 3) === 0 && (i % 5) === 0) {
    console.log("FizzBuzz");
  } else if ((i%3) === 0 && (i%5) !== 0) {
    console.log("Fizz");
  } else if ((i%5) === 0 && (i%3) !== 0) {
    console.log ("Buzz");
  } else {
    console.log(i);
  }
}

// vim: set ts=2 sts=2 sw=2 et:
