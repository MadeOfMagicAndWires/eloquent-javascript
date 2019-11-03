/**
  * Vector Exercise
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

"use strict";

// Write a class Vec that represents a vector in two-dimensional space.
// It takes x and y parameters (numbers), which it should save to
// properties of the same name.
//
// Give the Vec prototype two methods, plus and minus, that take another vector as
// a parameter and return a new vector that has the sum or difference of the two
// vectors’ (this and the parameter) x and y values.
//
// Add a getter property length to the prototype that computes the length of the
// vector—that is, the distance of the point (x, y) from the origin (0, 0).

/**
 * Represents a vector in two-dimensional space
 */

class Vec {
  /**
   * returns a new initiation of the Vec object,
   *
   * @param {Number} x point on the horizontal axis
   * @param {Number} y point on the vertical axis
   * @return {Vec} a new Vec object;
   *                  or undefined if either param is not a Number
   */
  constructor(x,y) {
    if(Number.isNaN(x) || Number.isNaN(y)) {
      return undefined;
    } else {
      this.x = x;
      this.y = y;
    }

  }

  /**
   * returns a new vector object equaling the sum of this instance and a
   * different vector object
   *
   * @param {Vec} otherVec the vector whose point to add to this instance
   * @return {Vec} a new Vec object containing the sum of both vectors
   */
  plus(otherVec) {
    if(!(otherVec instanceof Vec)) {
      return undefined;
    } else {
      return new Vec(this.x + otherVec.x, this.y + otherVec.y);
    }
  }

  /**
   * returns a new vector object equaling the difference between this instance
   * and a different vector object
   *
   * @param {Vec} otherVec the vector whose point to subtract
   *                             from this instance
   * @return {Vec} a new Vec object containing the difference of both vectors
   */
  minus(otherVec) {
    if(!(otherVec instanceof Vec)) {
      return undefined;
    } else {
      return new Vec(this.x - otherVec.x, this.y - otherVec.y);
    }
  }

  /**
   * returns the distance between this vector instance and the point 0,0
   */
  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}


/* Test Vec */
console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
// → 5
