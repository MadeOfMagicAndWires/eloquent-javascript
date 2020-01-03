/*
 * Shapes Exercise
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


/*
 * Write a program that draws the following shapes on a canvas:
 *
 * + A trapezoid (a rectangle that is wider on one side)
 * + A red diamond (a rectangle rotated 45 degrees or ¼π radians)
 * + A zigzagging line
 * + A spiral made up of 100 straight line segments
 * + A yellow star
 *
 * Notes: needed to cheat for the star one.
 */


const root = document.getElementsByTagName("canvas")[0];
const defaultSize = 50;

/**
 * Ensures that a parameter is a number
 *
 * @param {*} size - the parameter to ensure is a number
 * @return {Number} returns the given parameter if it was a number
 *                  or the defaultSize constant if it was not
 *
 */
function ensureSize(size) {
  return (size && !isNaN(size)) ? size : defaultSize;
}


/**
 * Retrieves and initiates a 2D Canvas context with certain values
 * @param {HTMLElement} canvas: the canvas element to create a context for
 * @param {String} [color="#000"]: fill and stroke color to use
 * @param {Number} [width=1]: the line width to set
 * @return {CanvasRenderingContext2D} the initiated canvas context
 *
 */
function prepareCanvas(canvas, color="#000", width=1) {
  let cx = canvas.getContext("2d");

  cx.fillStyle = color;
  cx.strokeStyle = color;
  cx.lineWidth = width;

  return cx;
}


/**
 * Draws a trapezoid on a canvas.
 * @param {HTMLElement} canvas: the canvas element to draw on
 * @param {Number} [offsetX=0]: pixel value to use as horizontal offset from 0,0
 * @param {Number} [offsetY=0]: pixel value to use as vertical offset from 0,0
 * @param {Number} [size=50]: the squared area in which to fit the shape in
 * @param {String} [color="#000"]: color value of which color use to stroke/fill
 *
 * @return {undefined}
 */
function drawTrapezoid(canvas, offsetX=0, offsetY=0, size=defaultSize,color="#000") {
  size = ensureSize(size);
  let cx = prepareCanvas(canvas, color);

  let lengthAB = size/2;
  let lengthCD = size;

  // Note: I'm sure there is a more clever way to
  // do this is less lines, calculating the angles or something
  // but I'm not a math person


  // translate it to offsetX offsetY; means we will just be able to use 0.
  cx.save();
  cx.translate(offsetX, offsetY);
  cx.beginPath();

  // line AB
  cx.moveTo((lengthAB/2),0);
  cx.lineTo(lengthAB * 1.5, 0);
  // line CD
  cx.lineTo(lengthCD, lengthCD);
  // line DB
  cx.lineTo(0 , lengthCD);
  // line AC
  cx.lineTo(lengthAB/2, 0);

  cx.stroke();

  // restore transform once we're done
  cx.restore();

}


/**
 * Draws a diamond on a canvas.
 * @param {HTMLElement} canvas: the canvas element to draw on
 * @param {Number} [offsetX=0]: pixel value to use as horizontal offset from 0,0
 * @param {Number} [offsetY=0]: pixel value to use as vertical offset from 0,0
 * @param {Number} [size=50]: the squared area in which to fit the shape in
 * @param {String} [color="#000"]: color value of which color use to stroke/fill
 *
 * @return {undefined}
 */
function drawDiamond(canvas, offsetX=0, offsetY=0, size=defaultSize, color="#000") {
  size = ensureSize(size);
  let cx = prepareCanvas(canvas, color);

  // the diagonals are the longest part and should fit in an area of
  // size*square; calculate the necessary side according to d = s√2
  let sideLength = size / Math.sqrt(2);

  console.log(`Drawing diamond with sides of length: ${sideLength}`);

  // offset drawing to specified coordinates
  cx.save();
  cx.translate(offsetX + ((sideLength - size) / 2), offsetY - ((sideLength - size)/2));

  // to rotate around the center translate it to
  // starting point + 0.5 the width/height
  cx.translate((sideLength/2), (sideLength/2));
  cx.rotate((Math.PI/180) * 45);
  cx.translate(-(sideLength/2), -(sideLength/2));
  cx.fillRect(0, 0, sideLength, sideLength);

  cx.restore();
  cx.restore();

}

/**
 * Draws a zig-zag line on a canvas.
 * @param {HTMLElement} canvas: the canvas element to draw on
 * @param {Number} [offsetX=0]: pixel value to use as horizontal offset from 0,0
 * @param {Number} [offsetY=0]: pixel value to use as vertical offset from 0,0
 * @param {Number} [size=50]: the squared area in which to fit the shape in
 * @param {String} [color="#000"]: color value of which color use to stroke/fill
 *
 * @return {undefined}
 */
function drawZigZag(canvas, offsetX=0, offsetY=0, size=defaultSize, color="#000") {
  size = ensureSize(size);
  let cx = prepareCanvas(canvas, color);

  // save regular (?) transform
  // then translate to regular position
  cx.save();
  cx.translate(offsetX, offsetY);

  cx.beginPath();
  cx.moveTo(0,0);

  // for every line move 5px downwards
  // and alternate x point
  for(let i=0;i < size; i += 5) {
    cx.lineTo((i % 10 === 0) ? 0 : size, i);
  }
  cx.stroke();

  // then restore transforms
  cx.restore();
}

/**
 * Draws a spiral on a canvas.
 * @param {HTMLElement} canvas: the canvas element to draw on
 * @param {Number} [offsetX=0]: pixel value to use as horizontal offset from 0,0
 * @param {Number} [offsetY=0]: pixel value to use as vertical offset from 0,0
 * @param {Number} [size=50]: the squared area in which to fit the shape in
 * @param {String} [color="#000"]: color value of which color use to stroke/fill
 * @param {Number} [loop=4]: amount of full loops to make;
 *                           higher number means more rings
 *
 * @return {undefined}
 */
function drawSpiral(canvas, offsetX=0, offsetY=0, size=defaultSize, color="#000", loop=4) {
  size = ensureSize(size);
  let cx = prepareCanvas(canvas, color);

  // offest everything to starting point
  cx.save();
  cx.translate(offsetX, offsetY);

  // starting point is center (size/2, size/2) radius is size/2 on both sides
  const startX = size/2, startY = startX, maxRadius = startX;

  // used to convert degrees to radians
  let deg = (Math.PI/180);

  // how many times the spiral goes round within the designated space.
  // higher number means more rings
  const rings = (300*loop);

  cx.beginPath();
  // cx.arc(startX, startY, 25, 270*deg, 0*deg);

  cx.moveTo(startX, startY);
  for(let i=0; i <= rings; i++) {
    let radius = (i * maxRadius) / rings;

    cx.lineTo(startX + (Math.cos(i*deg) * radius), startY + (Math.sin(i*deg) * radius));
  }
  cx.stroke();
  cx.restore();
}


/**
 * Draws a star on a canvas.
 * @param {HTMLElement} canvas: the canvas element to draw on
 * @param {Number} [offsetX=0]: pixel value to use as horizontal offset from 0,0
 * @param {Number} [offsetY=0]: pixel value to use as vertical offset from 0,0
 * @param {Number} [size=50]: the squared area in which to fit the shape in
 * @param {String} [color="#000"]: color value of which color use to stroke/fill
 * @param {Number} [points=8]: amount of points the star should have;
 *                             works best with even values
 *
 * @return {undefined}
 */
function drawStar(canvas, offsetX=0, offsetY=0, size=defaultSize, color="#000", points=8) {
  size = ensureSize(size);
  const cx = prepareCanvas(canvas, color);
  const controlPoint = {x: (size/2), y: (size/2)};
  const radius = (size/2);
  const angle = (2*Math.PI/(points));


  cx.save();
  cx.translate(offsetX, offsetY);

  cx.beginPath();
  cx.moveTo(controlPoint.x , controlPoint.y);

  for(let i=0;i<=points;i++) {
    // console.log(`radius: ${radius}`);
    // console.log(`x: ${controlPoint.x + Math.cos(i*angle) * radius}; y: ${controlPoint.y + Math.sin(i*angle) * radius}`);
    cx.quadraticCurveTo(
      controlPoint.x,
      controlPoint.y,
      controlPoint.x + Math.cos(i*angle) * radius,
      controlPoint.y + Math.sin(i*angle) * radius
    );
  }

  cx.fill();

  cx.restore();
}

// run script
if(root) {
  drawTrapezoid(root, 10, 10);
  drawDiamond(root, 85, 10, null, "#f00");
  drawZigZag(root, 135, 10);
  drawSpiral(root, 195, 10, null, "#000", 4);
  drawStar(root, 255, 10, null, "gold");
}

