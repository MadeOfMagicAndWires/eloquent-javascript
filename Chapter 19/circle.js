/**
 * Circle Exercise
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

// Define a tool called circle that draws a filled circle when you drag.
// The center of the circle lies at the point where the drag
// or touch gesture starts, and its radius is determined by the distance
// dragged.

/* eslint-disable no-undef,no-unused-vars */


/**
 * Draws a new circle in the picture
 *
 * @function
 * @param {Object} pos the current position of the pointer
 * @param {number} pos.x the x coordinate of the pointer
 * @param {number} pos.y the y coordinate of the pointer
 * @param {Object} state The current app state
 * @param {Picture} state.picture the current picture state
 * @param {string} state.color the current selected color
 * @param {function} dispatch the function to call as callback
 *
 * @returns {undefined}
 */
function circle(pos, state, dispatch) {
  function drawCircle(end) {
    let radius = Math.sqrt(
      Math.pow(end.x - pos.x, 2) +
      Math.pow(end.y - pos.y, 2)
    );

    let drawThese = [];

    for(let dy=-Math.ceil(radius);dy<=Math.ceil(radius);dy++) {
      for(let dx=-Math.ceil(radius);dx<=Math.ceil(radius);dx++) {
        //
        // check if the current point is actually * radius away or not
        let currentRad = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if(currentRad > radius) {
          continue;
        }

        let y = pos.y+dy, x = pos.x+dx;

        // check if the current point fits in the picture
        if(
          y < 0 || y >= state.picture.height ||
          x < 0 || x >= state.picture.width) {
          continue;
        }

        // remove 1 pixel sticking out that occurs with radius % 5
        if((radius % 5) === 0 && (Math.pow(dy, 2) === Math.pow(radius, 2)) ||
           (radius % 5) === 0 && (Math.pow(dx, 2) === Math.pow(radius, 2))
        ) {
          continue;
        }

        drawThese.push({x, y, color: state.color});
      }
    }
    dispatch({picture: state.picture.draw(drawThese)});
  }
  drawCircle(pos);
  return drawCircle;
}
