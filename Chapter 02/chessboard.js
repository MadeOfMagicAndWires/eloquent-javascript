/*
 * Exercise 3
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

// Write a program that creates a 8*8 grid, using newline characters to seperate
// lines. At each position of the grid is either a space or "#" character. The
// characters should form a chess board. When you have a program that generates
// this pattern, define a program so that it works for any size, outputing a a
// grid of the given witdth and height.

// Using /u25A0 and /u25A1 for clarity.

let size = 8;
let grid = "";

let black = '\u25A0';
let white = '\u25A1';

for (i=1;i<=size;i++) {

    //for each row add squares
    for (j=1;j<=size;j++) {
        // Add white or black square based on evenness of row and column.
        grid += ((j+i) % 2 === 0) ? black : white;
    }
    // finish row with newline
    grid += '\n';
}
console.log(grid)
