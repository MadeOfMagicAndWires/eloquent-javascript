/*
 * Precomputed Mirroring Exercise
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

// Think of a way to allow us to draw an inverted character without loading
// additional image files and without having to make transformed drawImage
// calls every frame.


/* eslint-disable no-unused-vars, no-undef */


const flippedPlayerSprites = document.createElement("canvas");

let flipContext = flippedPlayerSprites.getContext("2d");
let flippedContextInitiated = false;

/**
 * Initiales the context containing the flipped player sprites
 *
 * @returns {undefined}
 */
function createFlippedSprites() {
  flipContext.translate(playerSprites.naturalWidth, 0);
  flipContext.scale(-1, 1);
  flipContext.drawImage(playerSprites, 0 , 0);
  flipContext.translate(-playerSprites.naturalWidth, 0);

  if(!flippedContextInitiated) {
    flippedContextInitiated = true;
    // document.getElementsByTagName("body")[0].appendChild(flippedPlayerSprites);
  }
}

// Overwrite relative links to sprite image files
playerSprites = document.createElement("img");
playerSprites.addEventListener("load", createFlippedSprites);
playerSprites.src = "https://eloquentjavascript.net/img/player.png";
otherSprites = document.createElement("img");
otherSprites.src = "https://eloquentjavascript.net/img/sprites.png";

/**
 * Returns the Bitmap element containing the Player Sprites
 *
 * @param {Boolean} isFlipped=false Whether to retrieve the reversed or non-reverse sprites
 * @returns {CanvasImageSource} The bitmap source element containing the player sprites
 */
function getPlayerSprites(isFlipped=false) {
  console.log(isFlipped);
  if (isFlipped) {
    if(!flippedContextInitiated) {
      createFlippedSprite();
    }
    return flippedPlayerSprites;
  } else {
    return playerSprites;
  }
}

CanvasDisplay = window.CanvasDisplay;

/**
 * Draws the player sprite onto the CanvasDisplay
 *
 * @param {Player} player the player instance to draw
 * @param {Number} x The horizontal coordinate to draw the player at
 * @param {Number} y the vertical coordinate to draw the player at
 * @param {Number} width the width of the player sprite
 * @param {Number} height the height of the player sprite
 * @returns {undefined}
 */
CanvasDisplay.prototype.drawPlayer = function(player, x, y, width, height) {
  width += playerXOverlap * 2;
  x -= playerXOverlap;
  if (player.speed.x !== 0) {
    this.flipPlayer = player.speed.x < 0;
  }

  let tile = 8;

  if (player.speed.y !== 0) {
    tile = 9;
  } else if (player.speed.x !== 0) {
    tile = Math.floor(Date.now() / 60) % 8;
  }

  this.cx.save();


  let sprite = getPlayerSprites(this.flipPlayer);
  // console.log(sprite);
  let tileX = tile * width;

  this.cx.drawImage(sprite, tileX, 0, width, height,
    x, y, width, height);
  this.cx.restore();
};

// Run the game.
runGame(GAME_LEVELS, CanvasDisplay);


