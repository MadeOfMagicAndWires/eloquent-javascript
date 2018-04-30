/*
 * Exercise 03: Historical Life Expectancy
 *
 * Copyright (c) 2018 Joost Bremmer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Load ancestry JSON data.
let ANCESTRY_FILE;
if (typeof module != "undefined") {
  ANCESTRY_FILE = require("./data/ancestry.js");
}
let ancestry = JSON.parse(ANCESTRY_FILE);


ANCESTRY_FILE = require("./data/ancestry.js");
ancestry = JSON.parse(ANCESTRY_FILE);


// Compute and output the average age of the people in the ancestry data set per
// century by taking their year of death, dividing it by 100, and rounding it
// up, as in "Math.ceil(person.died / 100)"

function average(array) {
  return (array.reduce((a,b) => a+b) / array.length );
}

function groupBy(population, f) {
  let grouping = population.map(f);
  let groupMap = new Map();

  for(let [index, value] of grouping.entries()){
    if(!groupMap.has(value)) {
      groupMap.set(value, []);
    }
    groupMap.get(value).push(population[index]);
  }
  return groupMap;
}


function mapCentury(population) {
  let centuries = population.map((person) => Math.ceil(person.died / 100));
  let centuryMap = new Map();

  for (let [index, century] of centuries.entries()) {
    if(!centuryMap.has(century)) {
      centuryMap.set(century, []);
    }
    centuryMap.get(century).push(ancestry[index]);

  }
  return centuryMap;
}

function groupAverage(map) {
  let centuryAverages = {};

  for(const [i,group] of map) {
    centuryAverages[i] = average(group.map((person) => Math.round(person.died - person.born, 2)));
  }
  return centuryAverages;
}

let groupedAverage = groupAverage(mapCentury(ancestry));

for(const index in groupedAverage) {
  if(index) {
    console.log(index + " : " + groupedAverage[index].toFixed(1));
  }
}

console.log("\ngroupBy");

let groupedByInitials = groupBy(ancestry, (person) => {
  let re = /[A-Z]/g;

  return person.name.match(re).join(".");
});

for(let [index, group] of groupedByInitials) {
  if (index) {
    console.log(index);
    for(let person of group) {
      console.log("\t" + person.name);
    }
  }
}

// → 16: 43.5
//   17: 51.2
//   18: 52.8
//   19: 54.8
//   20: 84.7
//   21: 94

// vim: set ts=2 sts=2 sw=2 et:
