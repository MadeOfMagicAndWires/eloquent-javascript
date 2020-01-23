/**
 * Keyboard Bindings Exercise
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

// Add keyboard shortcuts to the application.
// The first letter of a tool’s name selects the tool,
// and control-Z or command-Z activates undo.


/* eslint-disable no-unused-vars,no-undef */

class PixelEditorWithKeyBinds extends PixelEditor {
  /**
   * Overloaded constructor
   *
   * @param {Object} state the current state of the app
   * @param {Picture} state.picture the picture that is currently being drawn
   * @param {function} state.tool the current tool being used
   * @param {color} state.color the current color selected
   * @param {Object} config The configuration of the app
   * @param {Array.function} config.tools the tools currently available
   * @param {Array.Control} config.controls the Classes that start their
   *                                     respective tools
   * @param {function} config.dispatch the function to dispatch actions
   */
  constructor(state, config) {
    // the keyboard event listener callback that handles undo and tool select
    function toolKeyBinding(event) {
      if(event.ctrlKey || event.metaKey) {
        if(event.key.toLowerCase() === "z") {
          event.preventDefault();
          config.dispatch({undo: true});
        }
      } else {
        for(let tool in config.tools) {
          if(event.key.toLowerCase() === tool.toLowerCase()[0]) {
            event.preventDefault();
            config.dispatch({tool});
          }
        }
      }
    }

    super(state, config);

    this.dom = elt(
      "div",
      {tabIndex: 0, onkeydown: toolKeyBinding},
      this.canvas.dom, elt("br"),
      ...this.controls.reduce(
        (a, c) => a.concat(" ", c.dom), []));
  }

  /**
   * Keyboard Event listener callback that will fire an undo action or select
   * the proper tool by its keyboard binding
   *
   * @param {KeyboardEvent} event the keyboard event that triggered the listener
   * @param {Object} config the app configuration
   * @param {Object} config.tools the tools available
   *
   * @returns {undefined}
   */
}

startPixelEditor = function({
  state = startState,
  tools = baseTools,
  controls = baseControls}) {
  let app = new PixelEditorWithKeyBinds(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    }
  });

  return app.dom;
};
