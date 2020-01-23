/*
 * Proper Lines Exercise
 * Copyright © 2020 Joost Bremer
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

// Improve the draw tool to make it draw a full line.
//
// A line between two pixels is a connected chain of pixels, as straight as possible,
// going from the start to the end. Diagonally adjacent pixels count as a connected.
//
// Finally, if we have code that draws a line between two arbitrary points,
// we might as well use it to also define a line tool, which draws a straight line
// between the start and end of a drag.

/* eslint-disable no-undef, no-unused-vars */

// The old draw tool. Rewrite this.

function oldDraw(pos, state, dispatch) {
  function drawPixel({x, y}, drawState) {
    let drawn = {x, y, color: state.color};

    dispatch({picture: drawState.picture.draw([drawn])});
  }
  drawPixel(pos, state);
  return drawPixel;
}


function drawFromTo(start, end, color) {
  let drawThese = [];

  let dX = end.x - start.x;
  let dY = end.y - start.y;
  let angle = Math.atan2(dX, dY);
  let distance = Math.sqrt(Math.pow(dX,2) + Math.pow(dY, 2));

  for(;distance>=0;distance--) {
    drawThese.push({
      x: Math.round(start.x + distance * Math.sin(angle)),
      y: Math.round(start.y + distance * Math.cos(angle)),
      color
    });
  }

  return drawThese;
}

draw = (curr, state, dispatch) => {
  function drawPixel(next, nextState) {
    let draw = drawFromTo(curr, next, state.color);

    curr = next;
    dispatch({picture: nextState.picture.draw(draw)});
  }

  drawPixel(curr, state);
  return drawPixel;
};


function line(pos, state, dispatch) {
  return (end) => {
    let drawThese = drawFromTo(pos, end, state.color);

    dispatch({picture: state.picture.draw(drawThese)});
  };
}
