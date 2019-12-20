/**
 * Tabs Exercise
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

// In this exercise you must implement a simple tabbed interface.
// Write a function, asTabs, that takes a DOM node and creates a tabbed interface
// showing the child elements of that node. It should insert
// a list of <button> elements at the top of the node,
// one for each child element, containing text retrieved from the data-tabname
// attribute of the child.
//
// All but one of the original children should be hidden.
// The currently visible node can be selected by clicking the buttons.

let tabs = document.querySelectorAll("#tab-panel .tab-content");
let tabNav = document.getElementById("tab-nav");
let tabBtns = new Array;


function showTab(event) {
  let activeTab = document.querySelector(
    `.tab-content[data-tab-name=${event.target.innerText}]`);

  for(let each of tabs) {
    if(each === activeTab) {
      each.dataset.tabActive = true;
    } else {
      each.dataset.tabActive = false;
    }
  }

  for(let btn of tabBtns) {
    if(btn === event.target) {
      btn.dataset.tabActive = true;
    } else {
      btn.dataset.tabActive = false;
    }
  }
}


function createTab(content) {
  let tab = document.createElement("button");

  tab.innerText = content.dataset.tabName;
  tab.dataset.tabName = content.dataset.tabName;
  tab.dataset.tabActive = content.dataset.tabActive;
  tab.addEventListener("click", showTab);
  return tab;
}


function anyTab() {
  Array.prototype.forEach.call(tabs, (tab) => {
    tabBtns.push(tabNav.appendChild(createTab(tab)));
  });
}


anyTab();
