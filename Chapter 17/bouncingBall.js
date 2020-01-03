/**
 * Bouncing Ball Exercise
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

// Use the requestAnimationFrame technique to draw a box
// with a bouncing ball in it.
// The ball moves at a constant speed and bounces off the box’s sides
// when it hits them.

// Notes:
// Overcomplicated things a bit, but this does allow the script to run
// with variable box sizes

/* eslint-disable no-undef */

const cx = document.getElementsByTagName("canvas")[0].getContext("2d");
let lastTime = null;


/**
 * Class representing a 2D box with borders
 *
 */
class Box {
  /**
   * Create a Box; not to be called directly unless you know what you are doing
   *
   * @param {Vector} start - the uppermost left-top point of the Box
   * @param {Vector} end   - the bottommost right-bottom point of the Box.
   *
   * @see Box#create to create a Box instance use this method instead
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }


  /**
   * create a new Box instance
   *
   * @static
   * @param {Number} startX=0 the horizontal coordinate of the starting point of the box
   * @param {Number} startY=0 the vertical coordinate of the starting point of the Box
   * @param {Number} width=100 the width of the Box
   * @param {Number} height=100 the height of the Box
   * @returns {Box} the created Box instance
   */
  static create(startX=0, startY=0, width=100, height=100) {
    let startPos = new Vec(startX, startY);


    return new Box(
      startPos,
      startPos.plus(
        new Vec(
          width,
          height
        )
      )
    );
  }

  /**
   * Returns the area of the Box
   *
   * @returns {Number} the total area of the Box
   */
  getArea() {
    return (this.getWidth() * this.getHeight());
  }

  /**
   * Returns a Path representation of the Box (without its contents)
   *
   * @returns {Path2D} The generated Path object
   */
  getPath() {
    let path = new Path2D();

    path.rect(
      this.start.x,
      this.start.y,
      this.end.x - this.start.x,
      this.end.y - this.start.y
    );
    return path;
  }

  /**
   * Returns the width of the Box
   *
   * @returns {Number} the width of this Box instance
   */
  getWidth() {
    return (this.end.x - this.start.x);
  }

  /**
   * Returns the height of the Box
   *
   * @returns {Number} The total height of this Box instance
   */
  getHeight() {
    return (this.end.y - this.start.y);
  }


}

/**
 * Represents a 2D Bouncing Ball
 */
class Ball {
  /**
   * Creates a Ball
   *
   * @param {Vector} pos Vector
   * @param {Number} radius=10 The radius of the Ball
   * @param {Vector} speed The speed of the Ball
   */
  constructor(pos, radius=10, speed) {
    this.pos = pos;
    this.speed = speed;
    this.radius = radius;
  }

  /**
   * Updates the position of the Ball
   *
   * @param {Number} time The time elapsed since last call
   * @param {Box} box The Box element the ball is inside of
   * @returns {undefined}
   */
  update(time, box) {
    let newPos = this.pos.plus(this.speed.times(time));


    // check if the edges of a ball at newPos hit the edges of the box.
    // if it hits the vertical edge, reverse the x speed
    // if it hits the horizontal edge, reverse the y speed
    // if it doesn't hit any edge, use newPos as the next position of the ball
    if((newPos.x - (this.radius) - 1) <= box.start.x ||
      (newPos.x + (this.radius) + 1) >= box.end.x) {
      return new Ball(
        this.pos,
        this.radius,
        new Vec(-this.speed.x, this.speed.y)
      );
    } else if((newPos.y - (this.radius) - 1) <= box.start.y ||
    ((newPos.y + (this.radius) + 1) >= box.end.y )) {
      return new Ball(
        this.pos,
        this.radius,
        new Vec(this.speed.x, -this.speed.y)
      );
    } else {
      return new Ball(newPos, this.radius, this.speed);
    }
  }

  /**
   * Creates a Ball instance
   *
   * @static
   * @param {Number} x=0 the horizontal coordinate of the Ball's centre point
   * @param {Number} y=0 the vertical coordinate of the Ball's centre point
   * @param {Number} radius=10 the radius of the Ball instance
   * @param {Number} speedX the horizontal speed of the Ball instance
   * @param {Number} speedY the vertical speed of the Ball instance
   * @returns {Ball} the created Ball instance
   */
  static create(x=0, y=0, radius=10, speedX, speedY) {
    return new Ball(new Vec(x, y), radius, new Vec(speedX, speedY));
  }


  /**
   * Returns a drawable Path that represents the Ball
   *
   * @returns {Path2D} The generated path of this Ball instance
   */
  getPath() {
    let path = new Path2D();

    path.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    return path;
  }

}

/**
 * Runs the animation
 *
 * @param {RenderingContext} context The canvas context to use for the animation
 * @returns {undefined}
 */
function run(context) {
  const box = Box.create(
    0,
    0,
    context.canvas.clientWidth,
    context.canvas.clientHeight
  );

  let ball = Ball.create(
    box.getWidth()/2,
    box.getHeight()/2,
    box.getArea()*0.00010,
    box.getArea()*0.000666,
    box.getArea()*0.0005
  );

  /**
   * Updates state for animation frame and redraws the canvas
   *
   * @param {Number} step the time that has passed
   * @returns {undefined}
   */
  function updateAnimation(step) {
    ball = ball.update(step, box);

    // clear the inside of the box.
    // then redraw the ball path;
    context.clearRect(
      box.start.x,
      box.start.y,
      box.getWidth(),
      box.getHeight());

    context.fillStyle = "#f00";
    context.fill(ball.getPath());
  }

  /**
   * Create a frame of animation
   *
   * @param {Number} time time elapsed since creation of the last frame
   * @returns {undefined}
   */
  function frame(time) {
    if (lastTime != null) {
      updateAnimation(Math.min(100, time - lastTime) / 1000);
    }
    lastTime = time;

    context.lineWidth = 1;
    context.strokeStyle = "#00f";
    context.stroke(box.getPath());
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

run(cx);
