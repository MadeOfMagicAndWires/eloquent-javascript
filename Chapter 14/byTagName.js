/**
 * Get Elements By Tag Name Exercise
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

// The document.getElementsByTagName method returns all child elements with a
// given tag name.
// Implement your own version of this as a function that takes a node and
// a string (the tag name) as arguments and returns an array containing
// all descendant element nodes with the given tag name.

/**
 * A manual implementation of document.getElementsByTagName
 * @param {Node} node - the root node you wish to find elements from
 * @param {String} tagName - the type of tag you wish to find
 * @return {Array} - array containing all matching elements;
 *                   empty if no elements were found or if it was passed the
 *                   wrong parameters
 *
 */
function byTagName(node, tagName) {
  function findTags(root, tag, elementArr=null) {
    // convert tagName
    tag = tag.toUpperCase();

    // create Array if needed
    if(!elementArr) {
      elementArr = new Array;
    }

    if(root.nodeType === 1 && root.nodeName === tag && !elementArr.includes(root)) {
      elementArr.push(root);
    }

    if(root.hasChildNodes()) {
      for(let i=0;i<root.childNodes.length;i++){
        if(root.childNodes[i].nodeType === 1) {
          elementArr = findTags(root.childNodes[i], tag, elementArr);
        }
      }
    } else if (root.nextSibling) {
      elementArr = findTags(root.nextSibling, tag, elementArr);
    }

    return elementArr;
  }

  if(!node || !(node instanceof Node) || !tagName || tagName === "") {
    return [];
  }

  return findTags(node, tagName, null);
}


// Test byTagName()

console.log(byTagName(document.body, "h1").length);
// → 1
console.log(byTagName(document.body, "span").length);
// → 3

let para = document.querySelector("p");

console.log(byTagName(para, "span").length);
// → 2
