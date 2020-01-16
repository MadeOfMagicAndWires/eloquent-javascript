/*
 * Conway's Game of Life JavaScript
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

const gridContainer = document.getElementById("grid");
const colInput = document.getElementById("cols");
const rowInput = document.getElementById("rows");
const pattern = document.getElementById("examples");
const next = document.getElementById("next_gen");
const gen = document.getElementById("generate");
const autoBtn = document.getElementById("auto_run");


let game = null;


/**
 * Class Representing an Error that occured in handling or initializing of a Game of Life grid
 *
 * @extends {Error}
 */
class BrokenGridError extends Error {
  /**
   * Constructor for a Broken Grid Error
   *
   * @constructor
   * @param {String} msg the message to show as a possible cause of the error
   */
  constructor(msg) {
    super((msg) ? msg : "Grid broke or was not initialized properly");
    this.name = "BrokenGridError";
  }
}

class ConwaysGame {

  /**
   * Creates a ConwaysGame instance
   *
   * @param {Array.Boolean[]} matrix a 2D array representing the fields on the grid to use as a board
   */
  constructor(matrix) {
    if(!(Array.isArray(matrix)) || !(Array.isArray(matrix[0]))) {
      throw new BrokenGridError("Source matrix was not set properly");
    }

    this.gameOver = false;

    // create properties as read-only; please impliment protected already.
    let _grid = matrix;
    let _rows = matrix.length;
    let _cols = matrix[0].length;

    Object.defineProperty(this, "grid", {
      get: () => _grid,
      set: () => null
    });
    Object.defineProperty(this, "rows", {
      get: () => _rows,
      set: () => -1
    });
    Object.defineProperty(this, "cols", {
      get: () => _cols,
      set: () => -1
    });
  }

  /**
   * Creates a new ConwaysGame instance, based on a provided board grid or pattern
   *
   * @static
   * @param {Array.Boolean[]|String} matrix The 2D Array,
   *                                        Stringified JSON object,
   *                                        or String pattern
   *                                        to parse as the game's board;
   *
   *                                        If the pattern provided is of type
   *                                        String; every line counts as a
   *                                        row, and every character in a line
   *                                        counts as a cell; with live cells
   *                                        represented by a "x" character.
   *
   *                                        e.g.:
   *
   *                                        "..x..
   *                                         x.x..
   *                                         xxx.."
   *
   *
   * @returns {ConwaysGame} a ConwaysGame instance based on the provided board
   */
  static from(matrix) {
    if(Array.isArray(matrix) && Array.isArray(matrix[0])) {
      return new ConwaysGame(matrix);
    } else if (matrix instanceof String || typeof matrix === "string") {
      if(matrix.startsWith("[")) {
        try {
          return new ConwaysGame(JSON.parse(matrix));
        } catch(e) {
          if(e instanceof SyntaxError) {
            throw new BrokenGridError(`Could not parse JSON matrix: ${e.message}`);
          }
        }
      } else {
        let grid = matrix.trim().split("\n").map(col => [...col.trim()]);

        grid = grid.map(col => col.map(cell => (cell === "x")));
        return new ConwaysGame(grid);
      }
    }
  }

  /**
   * Creates a ConwayGame instance with an empty board of size rows*cols
   *
   * @static
   * @param {Number} rows the amount of rows the board should have
   * @param {Number} cols The amount of columns the board should have
   * @returns {ConwaysGame} The Game instance containing the created game board
   */
  static empty(rows, cols) {
    const grid = new Array(rows);

    for(let row=0;row<rows;row++){
      grid[row] = new Array(cols);
    }

    return new ConwaysGame(grid);
  }

  /**
   * Creates a Conway game instance with a board of size rows*columns that is
   * randomly populated with live cells
   *
   * @static
   * @param {Number} rows the amount of rows the game board should have
   * @param {Number} cols The amount of columns the game board should have
   * @param {Number} [liveCells=0.3] the statistical percentage of population
   *                           that should be a live Cell;
   *                           represented as a integer between 0 and 1.
   * @returns {ConwaysGame} The initialized Game; populized with liveCells%
   *                        or about 30% live cells if liveCells is not provided
   */
  static random(rows, cols, liveCells=0.3) {
    const matrix = new Array(rows);

    for(let y=0;y<cols;y++) {
      matrix[y] = new Array(cols);
      for(let x=0;x<rows;x++) {
        matrix[y][x] = (Math.random() < liveCells);
      }
    }
    return new ConwaysGame(matrix);
  }

  /**
   * Returns the vaue of the cell row - column
   *
   * @param {Number} row the row the cell resides in; starting at 0
   * @param {Number} col the column the cell resides in; starting at 0
   * @returns {(Boolean|null)} true if the cell is alive; false otherwise
   *
   *                           Alternatively, it returns null if the cell
   *                           row - col does not exist on the board.
   */
  getCell(row, col) {
    if(row < this.rows && col < this.cols) {
      return (this.grid[row][col]); // cast to boolean
    } else {
      return null;
    }
  }

  /**
   * Sets the value of the cell 'row-column'
   *
   * @param {Number} row the row the cell resides in
   * @param {Number} col the column the cell resides in; starting at 0
   * @param {Boolean} value the value the cell should be set to; true for alive, false otherwise
   * @returns {(undefined|null)} Returns null if the cell "row-col" does not exist on the board
   */
  setCell(row, col, value) {
    if(row < this.rows && col < this.cols) {
      this.grid[row][col] = (value); // cast to boolean
    } else {
      return null;
    }
  }

  /**
   * Checks if the cell on row-column will survive until the next generation
   *
   * @param {Number} row the row the cell resides in
   * @param {Number} col the column the cell resides in
   * @returns {Boolean} true if the cell will survives in the next generation;
   *                    false otherwise
   */
  survivesNextGen(row, col) {
    let count = 0;

    for(let currRow=Math.max(0, row-1);currRow <= Math.min(row+1, this.grid.length-1);currRow++){
      for(let currCol=Math.max(0, col-1);currCol <= Math.min(col+1, this.grid[currRow].length-1);currCol++){
        if((currRow !== row || currCol !== col) && this.grid[currRow][currCol]) {
          count++;
        }
      }
    }

    switch(count) {
      case 2:
        return (this.grid[row][col]); // cast to Boolean, if it isn't one already
      case 3:
        return true;
      default:
        return false;
    }
  }

  /**
   * Returns a new game state, updated to the next generation
   *
   * @returns {ConwaysGame} a new ConwaysGame instance with the updated game state
   */
  nextGen() {
    let nextGrid = new Array(this.rows);

    for(let row=0;row<this.grid.length;row++){
      nextGrid[row] = new Array(this.grid[row].length);
      for(let col=0;col<this.grid[row].length;col++) {
        nextGrid[row][col] = this.survivesNextGen(row, col);
      }
    }

    // don't bother creating a new instance if the grid's are exactly the same.
    if(
      Array.isArray(nextGrid) && Array.isArray(nextGrid[0]) &&
      nextGrid.length === this.grid.length &&
      nextGrid[0].length === this.grid[0].length &&
      nextGrid.every(
        (row, y) =>
          row.every((cell, x) => cell === this.getCell(y, x)))
    ){
      this.gameOver = true;
      return this;
    }
    return ConwaysGame.from(nextGrid.slice());
  }


  /**
   * Returns a String representation of the game board
   *
   * @returns {String} A String representation of the board;
   *                   each line represents one row;
   *                   and each character one cell,
   *                   with "." representating a dead cell,
   *                   and "x" representing a live cell
   */
  toString() {
    return this.grid.reduce((output, row) => {
      return (output + row.reduce((lineOut, cell) => {
        return lineOut + ((cell) ? "x" : ".");
      }, "")).concat("\n");
    }, "");
  }
}

/**
 * Updates the current DOM Grid to reflect the current game state
 *
 * @see @{link ConwaysGame} for game instance
 * @returns {undefined}
 */
function updateDOMGrid() {
  for(let node of gridContainer.children) {
    let row = node.dataset.y, col = node.dataset.x;

    node.checked = game.getCell(row, col);
  }
}

/**
 * Draws the Grid as DOM Nodes inside the grid Container
 *
 * @param {ConwaysGame} game game instance containing the game state to
 *                           draw
 * @returns {undefined}
 * @see @{link ConwaysGame} for game instance
 */
function newDOMGrid() {

  // event listener callback that updates the game state every time a checkbox
  // is changed
  function onCellChanged(event) {
    let cell = event.target;

    game.setCell(cell.dataset.y, cell.dataset.x, cell.checked);
    game.gameOver = false;

    updateDOMGrid(game);
  }

  // remove old grid if any
  gridContainer.innerHTML = "";

  // Style container to show elements as grid
  gridContainer.style.display = "grid";
  gridContainer.style.grid = `auto-flow / repeat(${game.cols}, minmax(auto, 25px))`;


  // cycle through game grid and create checkboxes for each cell
  for(let y=0;y<game.rows;y++) {
    for(let x=0;x<game.cols;x++) {
      let cell = document.createElement("input");


      cell.type = "checkbox";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.name = `${y}-${x}`;
      cell.checked = game.getCell(y, x);
      cell.addEventListener("change", onCellChanged);

      gridContainer.appendChild(cell);
    }
  }
}



/**
 * Starts a new Game, creating a fresh grid from user inputted width and height
 *
 * @param {ConwaysGame|Array.Boolean[]|String}  state ConwaysGame instance or Matrix
 *                                                   Matrix pattern to use as the
 *                                                   new game state
 *
 * @returns {undefined}
 */
function newGame(state) {

  // event listener callback that starts a new game, based on
  // the selected example pattern if any
  function onStartNewGame() {
    switch(pattern.value) {
      case "null":
      case "random":
        game = ConwaysGame.random(
          parseInt(rowInput.value, 10),
          parseInt(colInput.value, 10)
        );
        break;
      case "empty":
        game = ConwaysGame.empty(
          parseInt(rowInput.value, 10),
          parseInt(colInput.value, 10)
        );
        break;
      default:
        /* eslint-disable-next-line no-undef */
        game = ConwaysGame.from(Patterns[pattern.value]);
        break;
    }
    newDOMGrid();
  }

  // event listener callback that runs the next turn
  function onNextTurn() {
    game = game.nextGen();
    updateDOMGrid(game);
  }

  // Factory function for the onAutoRun event listener callback
  function createOnAutoRun(run=false, fps=60) {
    let animation = null;
    let lastTime = null;

    // create the next frame, only actually updating the state
    // every interval provided by the fps counter
    function frame(time) {
      if(!lastTime) {
        lastTime = time;
      }
      let progress = time - lastTime;

      if(progress > 1000/fps) {
        lastTime = time;

        // update game state
        game = game.nextGen();

        // if we've reached the last possible state we
        // stop animating and reset the animation button
        if(game.gameOver === true) {
          cancelAnimationFrame(animation);

          // disable button
          run = false;
          autoBtn.disabled = true;
          autoBtn.innerText = (run) ? "Stop Autorun" : "Start Autorun";
          return;

        } else {
          updateDOMGrid();
        }
      }

      animation = requestAnimationFrame(frame);
    }

    return function onAutoRun(event) {
      run = !run;

      event.target.innerText = (run) ? "Stop Autorun" : "Start Autorun";
      if(run) {
        animation = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(animation);
      }
    };
  }



  // if the state is not a ConwaysGame instance already
  // try parsing one from the object that was given
  if(state instanceof ConwaysGame) {
    game = state;
  } else {
    game = ConwaysGame.from(state);
  }

  // draw the grid
  newDOMGrid();

  // add the event listeners
  rowInput.addEventListener("change", onStartNewGame);
  colInput.addEventListener("change", onStartNewGame);
  gen.addEventListener("click", onStartNewGame);
  next.addEventListener("click", onNextTurn);
  autoBtn.addEventListener("click", createOnAutoRun(false, 5));
}

newGame(
  ConwaysGame.random(
    parseInt(rowInput.value, 10),
    parseInt(colInput.value, 10)
  )
);
