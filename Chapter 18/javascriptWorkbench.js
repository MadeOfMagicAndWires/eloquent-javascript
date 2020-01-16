/*
 * Javascript Workbench Exercise
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


// Build an interface that allows people to type and run
// pieces of JavaScript code.

// elements
const input = document.getElementById("code");
const output = document.getElementById("output");
const run = document.getElementById("button");

// original console.log method
const superLog = console.log;

/**
 * Returns a formatted object based on the formatting of the placeholder
 * @param {String} placeholder placeholder containing the required output format
 *                             as second character
 * @param {Object} sub the object to replace the placeholder with
 * @return {Object} the correctly cast replacement to output
 */
function getRepl(placeholder, sub) {
  switch(placeholder[1]) {
  case "b":
    return (parseInt(sub, 10) >>> 0).toString(2);
  case "d":
    return parseInt(sub, 10);
  case "f":
    return parseFloat(sub, 10);
  case "o":
    return `${sub.constructor.name} ${(JSON) ? JSON.stringify(sub) : undefined}`;
  case "s":
    return sub.toString();
  default:
    return sub;
  }
}

/**
 * Overwritten console.log method that also prints its output to the <pre> element
 *
 * @param {String} msg String containing zero or more substitution strings
 * @param {Object} ...objs list of objects to output
 * @returns {undefined}
 */
console.log = function(msg, ...objs){
  const pattern = /%[bdfos]/g;
  let logOutput = msg;

  // call original console.log method to log things to the console as usual
  superLog(msg, ...objs);

  // if the first parameter contains substitution strings then parse them and
  // substitute and output the list of objs within the substitution string
  //
  // Otherwise, concat all parameters together and output the joined String.
  if(pattern.test(msg)) {
    let matches = logOutput.match(pattern);

    for(let i=0;i<matches.length;i++) {
      logOutput = logOutput.replace(matches[i], (objs[i] != null) ? `${getRepl(matches[i], objs[i])}` : "");
    }

    output.innerText += `${logOutput}`;
  } else {
    output.innerText += Array.prototype.join.call(arguments, "");
  }

  output.innerText += "\n";
};

/*
 * console.log("test");
 * console.log("test", " multiple", " parameters");
 * console.log("testing %s %s", "substrings", "substrings");
 * console.log("testing digits %d %f %d", 0, 66.5);
 * console.log("testing obj formatting: %o", {"type": "this is an Object"});
 */


/**
 * Creates and runs a new Function based on user inputted code
 *
 * @returns {undefined}
 */
function evalCode() {
  // clear previous output;
  output.innerText = "";
  output.style.color = null;

  // get user code from text area, try to run it
  // if we occur an error, output it in red.
  if(input && input.value) {
    try {
      let func = new Function("", input.value);

      if(func) {
        let ret = func();

        if(ret) {
          output.innerText += ret;
        }
      }
    } catch(e) {
      output.style.color = "#f00";
      output.innerText += `${e.constructor.name} ${e.message}\n`;
      output.innerText += `${e.stack}`;
    }
  }
}


// run code on button click and Ctrl+Enter in textarea
run.addEventListener("click", evalCode);
input.addEventListener("keydown",(event) => {
  if(event.key === "Enter" && event.ctrlKey) {
    evalCode();
  }
});





