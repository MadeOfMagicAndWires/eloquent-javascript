/**
 * Build a Table Exercise
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


// Given a data set of mountains,
// an array of objects with name, height, and place properties,
// generate the DOM structure for a table that enumerates the objects.
//
// It should have one column per key and one row per object,
// plus a header row with <th> elements at the top, listing the column names.
//
// Write this so that the columns are automatically derived from the objects,
// by taking the property names of the first object in the data.


const MOUNTAINS = [
  {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
  {name: "Everest", height: 8848, place: "Nepal"},
  {name: "Mount Fuji", height: 3776, place: "Japan"},
  {name: "Vaalserberg", height: 323, place: "Netherlands"},
  {name: "Denali", height: 6168, place: "United States"},
  {name: "Popocatepetl", height: 5465, place: "Mexico"},
  {name: "Mont Blanc", height: 4808, place: "Italy/France"}
];


function createRow(obj, cellType) {
  let row = document.createElement("tr");
  let keys = Object.keys(obj);

  for(let i=0;i<keys.length;i++) {
    let cell = document.createElement(cellType);

    cell.innerText = obj[keys[i]];
    console.log(typeof obj[keys[i]]);
    if(!isNaN(obj[keys[i]])) {
      cell.style.textAlign = "right";
    }

    row.appendChild(cell);
  }
  return row;
}

function createTable() {
  let table = document.getElementById("mountain-table") ?
    document.getElementById("mountain-table") :
    document.createElement("table");

  // add id if necessary
  if(!table.hasAttribute("id")) {
    table.id = "mountain-table";
  }


  // add table headers if necessary
  if(table.childElementCount <= 0) {
    let colKeys = Object.keys(MOUNTAINS[0]);

    let row = createRow(colKeys, "th");

    table.appendChild(row);
  }

  for(let mountain of MOUNTAINS) {
    table.appendChild(createRow(mountain, "td"));
  }

  return table;
}

let root = document.getElementById("mountains");

root.appendChild(createTable(root));


