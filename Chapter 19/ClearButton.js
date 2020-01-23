/*
 * Bonus Exercise: Reset Button
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

// A bonus exercise that creates a reset control,
// which clears the picture

/* eslint-disable no-undef, no-unused-vars */

class ResetButton {
  constructor(state, {dispatch}) {
    this.dom = elt("button", {
      onclick: (event) => {
        dispatch({
          picture: Picture.empty(60,30, "#f0f0f0"),
          done: [],
          doneAt: 0
        });

        event.target.disabled = true;
      },
      disabled: (state.done.length === 0)
    }, "⮪ Clear");
  }

  syncState(state) {
    this.dom.disabled = (state.done.length === 0);
  }
}
