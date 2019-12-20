/**
 * Balloon Exercise JavaScript
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

// Write a page that displays a balloon (using the balloon emoji, 🎈).
// When you press the up arrow, it should inflate (grow) 10 percent,
// and when you press the down arrow, it should deflate (shrink) 10 percent.

let balloon = document.getElementById("balloon");

function changeSize(event) {

  // get fontsize from element or computed style
  let fontSizeStyle = (balloon.style.fontSize && balloon.style.left) ?
    balloon.style.fontSize :
    getComputedStyle(balloon, null).getPropertyValue("font-size");

  // split into value and unit; yes this regex makes sense
  // https://drafts.csswg.org/css-values-3/#font-relative-lengths
  fontSizeStyle = fontSizeStyle.match(/([\d.]+)([ceihmnprtx]+)/);

  let currentSize = parseFloat(fontSizeStyle[1]);
  let newSize;

  if(event.key === "ArrowUp") { // arrow up event
    newSize = currentSize + (currentSize * 0.1);

    // if the balloon fits in the window inflate it; otherwise it bursts
    if(newSize < innerHeight && newSize < innerWidth) {
      balloon.style.fontSize =
      `${newSize}${fontSizeStyle[2]}`; // e.g. 32.32px
    } else {
      balloon.innerHTML = "&#x1f4a5;"; // 💥
      balloon.style.opacity = 0;
      document.body.removeEventListener("mousedown", balloon);
    }
  } else if(event.key === "ArrowDown") { // arrow down event
    newSize = currentSize - (currentSize * 0.1);

    // if the baloon is still larger than 1 fontsize or 16px|pt then deflate it
    // otherwise don't do anything
    if(fontSizeStyle[2].match(/[cehm]+|in|pc/) && currentSize > 1 ||
       fontSizeStyle[2].match(/p[tx]/) && currentSize > 16) {
      balloon.style.fontSize =
        `${newSize}${fontSizeStyle[2]}`; // e.g. 16px
    }
  }
}

// add event listener to body
document.body.addEventListener("keydown", changeSize);
