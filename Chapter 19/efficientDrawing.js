/**
 * Efficient Drawing Exercise
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

/* eslint-disable no-unused-vars, no-undef */

// Find a way to make the syncState method of PictureCanvas faster
// by redrawing only the pixels that actually changed.


/**
 * Checks if a picture array and its values equal the saved picture state
 *
 * @method PictureCanvas#getChangedPixels
 * @memberof PictureCanvas
 * @param {Array} picture the new picture state to check for changed pixels
 * @returns {Object|null} Object containing a list of the changed pixels
 *                  pixels are saved under [pixelIndex] : color
 *                  false if no pixels have changed, or if current picture state
 *                  is unknown
 */

PictureCanvas.prototype.getChangedPixels = function(picture) {
  if(this.picture == null || this.picture === picture) {
    null;
  } else if(Array.isArray(picture.pixels)) {
    return picture.pixels.reduce((indexes, pixel, index) => {
      return (pixel === this.picture.pixels[index]) ?
        indexes :
        Object.assign({}, indexes, {[index]: pixel});
    }, null);
  }
};


/**
 * Updates and redraws the picture based on the new state
 *
 * @namespace PictureCanvas
 * @method PictureCanvas#syncState
 * @memberof PictureCanvas
 * @param {Array} picture the new picture state to update to
 * @returns {undefined}
 */
PictureCanvas.prototype.syncState = function(picture) {
  // get all changed pixels
  const changed = this.getChangedPixels(picture);

  // if no pixels were changed, and we have an already existing picture
  // don't do anything.
  if (this.picture != null && !changed) {
    return;
  }

  drawPicture(picture, this.dom, scale, changed);
  this.picture = picture;

};

/**
 * Draws a 2D picture onto a canvas element
 *
 * @param {Array} picture picture state to draw
 * @param {HTMLCanvasElement} canvas canvas DOM element to draw picture onto
 * @param {Number} scale the scale to draw the picture at
 * @param {Object|null} changed object containing changed pixels with pattern
 *                               of {[pixelIndex] = color};
 *                               or null if this is the first draw or
 *                               no pixels are changed.
 *
 * @see {@link PictureCanvas#getChangedPixels} to get the changed object from a picture
 *                                      state
 * @returns {undefined}
 */
drawPicture = function(picture, canvas, scale, changed) {
  // only update size on first draw
  if(changed == null) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
  }

  let cx = canvas.getContext("2d");


  // on first draw no changes are known (change = null)
  // so we'll draw the entire picture pixel by pixel.
  // Otherwise, we'll only update the pixels that have changed.
  if(changed != null) {
    for(let index in changed) {
      if(Object.prototype.hasOwnProperty.call(changed, index)) {
        let x = Math.floor(index%picture.width),
            y = Math.floor(index/picture.width);

        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  } else {
    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
};
