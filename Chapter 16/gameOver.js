/*
 * Game Over Exercise
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

// It’s traditional for platform games to have the player start with a limited number of lives
// and subtract one life each time they die.
// When the player is out of lives, the game restarts from the beginning.
//
// Adjust runGame to implement lives.
// Have the player start with three.
// Output the current number of lives (using console.log) every time a level starts.

const DEFAULT_LIVES = 3;

/* eslint-disable no-undef,no-unused-vars */
async function runGame(plans, Display, lives=DEFAULT_LIVES) {
  for (let level = 0; level < plans.length;) {
    for(let remainingLives=lives;remainingLives>0;) {
      console.log(`Remaining lives: ${remainingLives}`);
      let status = await runLevel(new Level(plans[level]), Display);

      if (status === "won") {
        console.log("You won!");
        level++;
      } else if(status === "lost") {
        remainingLives--;
        console.log("You lost!");
        // reset if all lives are spent
        if(remainingLives === 0) {
          console.log("Game Over!");
          level = 0;
        }
      }
    }
  }
}
