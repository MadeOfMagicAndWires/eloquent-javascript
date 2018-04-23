/*
 * Exercise 02: Reverse Array
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

// For this exercise wrote two functions, 'reverseArray' and 'reverseArrayInPlace'.

// 'reverseArray' takes an array as argument and produces a new array that has
// the same elements in reverse order.

function reverseArray(arr) {
    let newarr = [];
    do {
        let item = arr.pop(-1);
        newarr.push(item);
    } while (arr.length > 0);
    return newarr;
}

// the second , 'reverseArrayInPlace' does what the reverse method does: it
// modifies the array ginve as argument in order to reverse its elements.

function reverseArrayInPlace(arr) {
    for(let i=0;i < Math.floor(arr.length /2);i++) {
        let buff = arr[i];
        arr[i] = arr[(arr.length - 1) - i];
        arr[(arr.length-1) - i] = buff;
    }
}

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
