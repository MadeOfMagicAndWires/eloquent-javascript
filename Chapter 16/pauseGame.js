/**
 * Pause Game Exercise
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

// Make it possible to pause (suspend) and unpause the game by pressing the Esc key.
//
// This can be done by changing the runLevel function to use another keyboard
// event handler and interrupting or resuming the animation
// whenever the Esc key is hit.

// Notes:
// I have absolutely no idea what is going on with the scoping of this.
// Had a working version that did not put everything inside the Promise, but
// apparently resolved cannot be called from outside of the promise element.
//
// Would try to find a way to fix this, but debugging within animations is hell

/**
 * Handles the tracking of keys related to motion within the game
 * @param {String[]} keys - list of keys to track; must be one of
 *                          the default values
 * @param {HTMLElement} root - element to attach listeners to
 *
 * @return {Object} - object containing tracked keys and a function to
 *                    remove them
 * @see \
 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 *
 */
function trackKeys(keys, root) {
  let down = Object.create(null);

  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = (event.type === "keydown");
      event.preventDefault();
    }
  }
  root.addEventListener("keydown", track);
  root.addEventListener("keyup", track);
  down.removeEventListeners = () => {
    root.removeEventListener("keydown", track);
    root.removeEventListener("keyup", track);
  };

  return down;
}

/* eslint-disable no-undef,no-unused-vars */

/**
 * Handles displaying and updating a level display of a specific level
 * @param {String} level - a simple level layout to parse
 * @param {Display} Display - the Display interface to use
 * @return {Promise} - a promise that resolves as soon as the level has
 *                     completed.
 *
 */
function runLevel(level, Display) {
  let display = new Display(document.body, level);
  let state = null;
  let ending = 1;

  arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"], document.body);



  return new Promise(resolve => {
    let paused = false;
    let pauseListener = null;

    /**
     * Adds a keyboard listener that pauses the game whenever "Escape" is
     * pressed.
     * @param {HTMLElement} root - element to attach the listener to
     * @param {function} animationCallback -
     *                              callBack function to call whenever the game
     *                              is unpaused
     *
     * @return {Object} - contains the function remove() that removes the event
     *                    listener
     *
     *
     */
    function addPauseListener(root, animationCallback) {
      /**
       * Toggles the paused state of the game whenever "Escape is pressed;
       * Needs to added as event listener under "keyup" or "keydown"
       * @param {KeyboardEvent} event  - keyboard event provided by an event listener
       *
       * @return {undefined}
       *
       */
      function escapeListener(event) {
        if(event.key === "Escape") { // pause game if escape is pressed
          paused = !paused;
          console.log(`Toggling paused state to: ${paused}`);
          // if game is unpaused; animate it again
          if(!paused) {
            runAnimation(animationCallback);
          }
          event.preventDefault();
        }
      }

      root.addEventListener( "keydown", escapeListener);
      return {
        remove: () => {
          root.removeEventListener("keydown", escapeListener);
        }
      };
    }

    /**
     * Animation function called by runAnimation to produce one frame
     * @param {Number} time - time in miliseconds for the frame to last
     * @param {Function} callBack - function to call once the level
     *                              has finished
     * @return {Boolean} - true when we need to update the display; false if
     *                     we should stop (i.e. game is paused or finished)
     */
    function animate(time) {
      if(paused) {
        return false;
      }
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state && state.status === "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        if(pauseListener && typeof pauseListener.remove === "function") {
          pauseListener.remove();
        }
        arrowKeys.removeEventListeners();
        if(typeof resolve === "function") {
          resolve(state.status);
        }
        return false;
      }
    }



    console.log("Overwritten");
    state = State.start(level);
    pauseListener = addPauseListener(document.body, animate);

    runAnimation(animate);
  });
}
