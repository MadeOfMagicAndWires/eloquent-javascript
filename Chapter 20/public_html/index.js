/**
 * A Public Place on the Web
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

const actions = document.querySelectorAll("input[name='action']");
const fileTypes = document.querySelectorAll("input[name='file_type']");
const fileDropdown = document.getElementById("choose_existing_file");
const newFilePath = document.getElementById("choose_new_file_path");
const isDir = document.getElementById("path_is_dir");
const fileContent = document.getElementById("content");
const submit = document.getElementById("submit");
const output = document.getElementById("output");

/**
 * Logs any error messages to the dedicated UI element
 *
 * @param {String|Error} error the error message to log
 * @returns {undefined}
 */
function err(error, ...messages) {
  output.classList.remove("success");
  output.classList.add("error");
  if(error instanceof Error) {
    output.innerText = error.message;
  } else {
    output.innerText = String.prototype.concat.call(error.toString(), ...messages);
  }
}

/**
 * Logs any output to the dedicated UI element
 *
 * @param {String|Error} msg message to log
 * @returns {undefined}
 */
function log(msg) {
  // clear previous message
  log.innerText = "";

  // animate frame, log previous message.
  if(output instanceof Error) {
    requestAnimationFrame( () => err(msg));
  } else {
    requestAnimationFrame(() => {
      output.classList.remove("error");
      output.classList.add("success");
      output.innerText = msg.toString();
    });
  }
}


/**
 * Wrapper function that makes a request to the API
 *
 * @param {String} apiMethod="GET" the HTTP method to use,
 *                                 defines what action will be taken
 * @param {String} path="/" the local path,
 *                          defines where API action will be taken
 * @param {(Blob|BuuferSource|FormData|URLSearchParams|USVString|ReadableStream)} body request data to pass along with request
 *
 * @returns {Promise} Result of fetch request,
 *                    resolves {@link Request.Body} object
 *                    or rejects with the response status code
 */
function makeAPIRequest(apiMethod="GET", path="/", body=null) {
  return new Promise((resolve, reject) => {
    // make sure path starts at root directory
    path = new URL(path.replace(/^\//,""),
      `${window.location.protocol}//${window.location.host}/`);

    fetch(path, {method: apiMethod, body}).then(resp => {
      if(resp.ok) {
        resolve(resp);
      } else {
        resp.text().then((text) => {
          reject({error: resp.status, msg: resp.statusText, body: text});
        });
      }
    }).catch(error => {
      reject({error, msg: error.message});
    });

  });
}


/**
 * Returns the currently selected HTTP method
 *
 * @returns {String} the currently selected HTTP method as a String
 */
function getMethod() {
  let method = Array.prototype.filter.call(actions, action => action.checked)[0].value;

  return (isDir.checked && method === "PUT") ?
    document.getElementById("choose_mkdir").value :
    method;
}


/**
 * Returns the selected file type
 *
 * @returns {String} the value of the selected file type
 */
function getFileType() {
  return Array.prototype.filter.call(fileTypes, (type) => type.checked)[0].value;
}

/**
 * Returns the selected file path
 *
 * @returns {String|String[]} the relative path of the currently selected file,
 *                            or, if the selected method is "MOVE", an array of
 *                            the relative paths of both an existing file and
 *                            its new path
 */
function getSelectedFile() {
  if(getMethod() !== "MOVE") {
    if(getFileType() === "existing") {
      return fileDropdown.value;
    } else if(getFileType() === "new") {
      return newFilePath.value;
    }
  } else {
    return [fileDropdown.value, newFilePath.value];
  }
}

/**
 * Retrieves the paths of all files available on the server and adds them
 * to a pulldown menu
 *
 * @param {HTMLSelectElement} select the pulldown menu to insert files into
 * @returns {undefined}
 */
function getDirectoryListing(select) {
  // request recursive directory listing from root
  makeAPIRequest("GET", "/?mode=recursive").then(res => {
    // transform response to text, then
    // add each path that represents a file to the select field as an option
    // if it doesn't already exist
    // (dirs are represented by a trailing slash)
    res.text().then((files) => {
      files.split("\n").forEach(
        (file) => {
          // retrieve or create option element referencing  the file
          let opt = (select.options.namedItem(file) == null) ?
            document.createElement("option") : select.options.namedItem(file);

          opt.value = file;
          opt.id = file.replace(/\/$/, "");
          opt.innerText = file;
          opt.disabled = !(getMethod() === "MOVE" || getMethod() === "DELETE" || !file.endsWith("/"));

          // add it to the dropdown if it isn't already
          if(!select.contains(opt)) {
            select.add(opt);
          }
        });
    }).catch(error => {
      // catch errors in res.text() call
      err(error);
    });
  }).catch(({error, message, body}) => {
    // catch errors in makeAPIRequest() call
    if(!body) {
      err(error, body);
    } else {
      err(error, message);
    }
  });
}


/**
 * Retrieves the contents of a file and inserts it into a textarea element
 *
 * @param {string} path the relative path of the file to retrieve from the
 *                      server
 * @param {HTMLTextAreaElement} container the textarea element to insert the
 *                                      file's content into
 * @returns {undefined}
 */
async function getFileContent(path, container) {
  // clear current textarea
  container.value = "";
  container.placeholder = "Create a new file";

  // if request succeeded then insert response into the textarea,
  // else if fetch returned 404, switch to "edit file" mode, update placeholder to
  // notify user this is a new file
  //
  // else show error code as placeholder to notify user of the returned error
  if(path && path !== "") {
    makeAPIRequest("GET", path).then(res => {
      res.text().then(content => {
        if(content === "") {
          container.placeholder = "File is empty...for now.";
        } else {
          container.value = content;
        }
      });
    }).catch(
      ({error, msg}) => {
        console.log(error, msg);
        if(error && error === 404) {
          // set action to "edit file", file type to "new", and new file path = path
          Array.prototype.filter.call(
            actions, action => action.value === "PUT"
          )[0].click();
          Array.prototype.filter.call(
            fileTypes, type => type.value === "new"
          )[0].click();
          document.getElementById("choose_new_file_path").value =
            (path.startsWith("/")) ? `${path}` : `/${path}`;
        } else {
          err(`${err}: ${msg}`);

        }
      });
  }
}

/**
 * callback function for when an action is fileType
 *
 * Saves the associated HTTP method to global {@link form#method} and
 * disables disallowed file type options based on action.
 *
 * @param {Event} event the event that caused this function to be called
 * @returns {undefined}
 */
function onPickAction(event) {
  // set method
  let method = event.target.value.toString();


  let existingFile = document.getElementById("pick_existing_file");
  let newFile = document.getElementById("pick_new_file");
  let allowNewFile = (
    method.toUpperCase() !== "DELETE" &&
    method.toUpperCase() !== "GET" &&
    method.toUpperCase() !== "MOVE");
  let allowDirectoryAction =
    (method === "MOVE" || method === "DELETE");

  let hasChanged = new CustomEvent("change");

  // we disable the "new file" option for read/delete/move actions
  // (as you cannot delete or read a non-existing file)
  //
  // also disable submit for "read " action and
  // disable fileContent for "delete" or "move" action
  newFile.checked = (newFile.checked && allowNewFile);
  newFile.disabled = (!allowNewFile);
  existingFile.checked = (existingFile.checked || !allowNewFile);
  submit.disabled = (method === "GET");
  fileContent.disabled = (method === "DELETE" || method === "MOVE");

  // also, if "move" or "delete" is selected we need to enable directories
  // in the existing file dropdown
  for(let option of fileDropdown.options) {
    option.disabled = !(allowDirectoryAction || !option.value.endsWith("/"));
  }

  isDir.disabled = !(method === "PUT");

  // finally simulate changed event for file type inputs
  existingFile.dispatchEvent(hasChanged);

}

/**
 * Callback function for when a file type has been fileType
 *
 * Makes the correct file input form visible based on the selected
 * file type
 *
 * @param {Event} event the event that caused this function to be called
 * @returns {undefined}
 */
function onPickFileType(event) {
  const existingFileContainer =
    document.getElementById("choose_existing_file_container");
  const newFileContainer = document.getElementById("choose_new_file_container");
  let picked;

  switch(event.target.value) {
    case "existing":
      picked = existingFileContainer;
      break;
    case "new":
      picked = newFileContainer;
      // empty file content
      getFileContent(null, fileContent);
      break;
    default:
      picked = null;
      break;
  }

  // show the correct next input (drop down of existing files or text input for
  // a new file's path) based on which file type was selected.
  if(event.target.checked) {
    switch(picked) {
      case existingFileContainer:
        existingFileContainer.classList.remove("hidden");
        newFileContainer.classList.add("hidden");
        break;
      case newFileContainer:
        console.log("picked is new");
        newFileContainer.classList.remove("hidden");
        existingFileContainer.classList.add("hidden");
        break;
      default:
        existingFileContainer.classList.add("hidden");
        newFileContainer.classList.add("hidden");
        break;
    }
  }

  // if method is MOVE we need both inputs, so show them
  if(getMethod() === "MOVE") {
    existingFileContainer.classList.remove("hidden");
    newFileContainer.classList.remove("hidden");
  }

}

/**
 * callback function for when a file has been selected from a <select>
 * menu
 *
 * inserts the file's contents into {@link content}
 *
 * @param {Event} event the event that caused this function to be called
 * @returns {undefined}
 */
function onSelectedFileFromDropDown(event) {
  getFileContent(event.target.value, fileContent);
}


/**
 * submits a request to the file server
 *
 * @param {Event} event the event that fires this callback function
 * @returns {undefined}
 */
function onSubmit() {
  // callback function for when makeAPIRequest resolved successfully
  function onRequestResolvedSuccesfully(method, path) {
    log("Changes saved!");
    // remove deleted/moved items from exisitng files dropdown
    if(method === "MOVE" || method === "DELETE") {
      fileDropdown.removeChild(fileDropdown.namedItem(path));

      for(let option of fileDropdown.options) {
        if(option.value.startsWith(path)) {
          fileDropdown.removeChild(option);
        }
      }
    }
    // update existing files dropdown
    getDirectoryListing(fileDropdown);
    getFileContent(getSelectedFile(), fileContent);
  }



  let data = null;
  let method = getMethod();
  let url = "";

  // create request body if necessary
  switch(method) {
    case "POST":
    case "PUT":
      url += getSelectedFile();
      data = fileContent.value;
      break;
    case "MOVE":
      var paths = getSelectedFile();

      url += paths[0].replace(/\/$/,"");
      data = JSON.stringify({"newPath": `/${paths[1]}`});
      break;
    default:
      url += getSelectedFile();
      break;
  }

  // make request based on input fields
  // on success update UI
  // on failure log error
  makeAPIRequest(method, url, data).then(
    () => {
      onRequestResolvedSuccesfully(method, url);
    }
  ).catch(
    ({error, msg, body}) => {
      if(error !== 301) {
        if(body) {
          err(`${error}: ${body}`);
        } else {
          err(`${error}: ${msg}`);
        }
      } else {
        onRequestResolvedSuccesfully(method, url);
      }
    }
  );
}

/**
 * Initiates event listeners for all form input elements
 *
 * @returns {undefined}
 */
function initEventListeners() {
  // add action radio button group event listener
  for(let action of actions) {
    action.addEventListener("change", onPickAction);
  }

  // add fileType radio button group event listener
  for(let type of fileTypes) {
    type.addEventListener("change", onPickFileType);
  }

  // retrieve initial file name values and set its event listener
  getDirectoryListing(fileDropdown);
  fileDropdown.addEventListener("change", onSelectedFileFromDropDown);


  // add submit button event listener
  submit.addEventListener("click", onSubmit);
}

/**
 * Runs the script by setting intial values and adding event listeners for
 * the various form elements
 *
 * @returns {undefined}
 */
function run() {
  // add event listeners
  initEventListeners();

  // pre-select read file action on start
  Array.prototype.filter.call(actions, action => action.value === "GET")[0].click();

  // update fileDropdown and fileContent input values
  getFileContent(fileDropdown.options[0].value, fileContent);
}

run();
