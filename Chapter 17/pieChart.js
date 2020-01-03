/**
 * Pie Chart Exercise
 * Copyright © 2020 Joost Bremmer
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


// We saw an example program that drew a pie chart.
// Modify this program so that the name of each category is shown next to the
// slice that represents it.

const results = [
  {name: "Satisfied", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Unsatisfied", count: 510, color: "pink"},
  {name: "No comment", count: 175, color: "silver"}
];

const cx = document.querySelector("canvas").getContext("2d");
const total = results.reduce((sum, {count}) => sum + count, 0);
const centerX = 300, centerY = 150;
let currentAngle = -0.5 * Math.PI;

// Add code to draw the slice labels in this loop.
for (let result of results) {
  let sliceAngle = (result.count / total) * 2 * Math.PI;

  cx.beginPath();
  cx.arc(centerX, centerY, 100,
    currentAngle, currentAngle + sliceAngle);
  currentAngle += sliceAngle;
  cx.lineTo(centerX, centerY);
  cx.fillStyle = result.color;
  cx.fill();

  // calculate coordinates for the label (move back to half of the slice)
  // use a radius of 150 for x (50px padding)
  // and 125 for y (25px of padding)
  let label = {
    "x" : (Math.cos(currentAngle - (sliceAngle/2)) * 150) + centerX,
    "y" : (Math.sin(currentAngle - (sliceAngle/2)) * 125) + centerY
  };

  cx.fillStyle = "#000";
  cx.textAlign = "center";
  cx.font = "10pt Noto Sans";
  cx.fillText(result.name, label.x, label.y);
}
