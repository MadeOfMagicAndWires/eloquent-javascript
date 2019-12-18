/**
 * The Cat's Hat Exercise JavaScript
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



function animateObjects (firstObj, secObj, angle=Math.PI/2) {
  function animate(time, lastTime) {
    if (lastTime != null) {
      angle += (time - lastTime) * 0.001;
    }
    firstObj.style.top = `${Math.sin(angle) * 100 + 100 }px`;
    firstObj.style.left = `${Math.cos(angle) * 100 + 100}px`;

    requestAnimationFrame(newTime => animate(newTime, time));
  }

  function reverseAnimate(time, lastTime) {
    if(lastTime != null) {
      angle += (time-lastTime) * 0.001;
    }

    secObj.style.top = `${Math.sin(angle + Math.PI) * 100 + 100}px`;
    secObj.style.left = `${Math.cos(angle + Math.PI) * 100 + 100}px`;

    requestAnimationFrame(newTime => reverseAnimate(newTime, time));
  }

  requestAnimationFrame(animate);
  requestAnimationFrame(reverseAnimate);

}

animateObjects(document.getElementById("cat"), document.getElementById("hat"));

