/**
 * Mouse Trail Exercise
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

// Implement a mouse trail.
// Use absolutely positioned <div> elements with a fixed size and
// background color (refer to the code in the “Mouse Clicks” section for an example).
// Create a bunch of such elements and, when the mouse moves, display them in
// the wake of the mouse pointer.

const crumbs = new Array;
let index = 0;
let scheduled = null;
let clear = null;

function drawTrail(event) {
  if(crumbs.length < 1) {
    for(let i=0;i<20;i++) {
      let crumb = document.createElement("div");

      crumb.classList.add("trail");
      crumbs.push(crumb);
    }
  }

  if(index > crumbs.length) {
    index = 0;
  }

  requestAnimationFrame(() => {
    let crumb = crumbs[index];

    crumb.style.opacity = 1;
    crumb.style.left = `${event.clientX + 6}px`;
    crumb.style.top = `${event.clientY + 6}px`;
    if(crumb.parentNode !== event.target) {
      document.body.appendChild(crumb);
    }
  });
  index++;
}

function clearTrail() {
  function clearCrumb(time, crumb, start) {
    if(!start) {
      start = time;
    }
    let progress = time - start;

    if(progress <= 1000) {
      crumb.style.opacity = (1000 - progress ) / 1000;
      requestAnimationFrame(newTime => clearCrumb(newTime, crumb, start));
    }
  }

  let trail = document.getElementsByClassName("trail");

  Array.prototype.forEach.call(trail, (crumb) => {
    requestAnimationFrame(time => clearCrumb(time, crumb));
  });
}

document.body.addEventListener("mousemove", (event) => {
  if(!scheduled) {
    setTimeout(() => {
      drawTrail(event);
      scheduled = null;
    }, 50);
  }
  clearTimeout(clear);
  clear = setTimeout(clearTrail, 1000);
  scheduled = event;
});
