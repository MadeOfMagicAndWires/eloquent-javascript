/**
 * Regex Golf Exercise
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


/**
 * For each of the following items, write a regular expression
 * to test whether any of the given substrings occur in a string.
 * The regular expression should match only strings containing
 * one of the substrings described.
 * Do not worry about word boundaries unless explicitly mentioned.
 * When your expression works, see whether you can make it any smaller.
 */

/**
 * Verifies a regexp expression on an array of items to match
 * @param {RegExp} regexp -  a regular expression to test
 * @param {String[]} yes - an array of strings that *should* match the regex
 * @param {String[]} no - an array of string that *should not* match the regex
 * @return {undefined}
 */
function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source === "...") { return; }
  for (let str of yes) {
    if (!regexp.test(str)) {
      console.error(`Failure to match '${str}'`);
      return;
    }
  }

  for (let str of no) {
    if (regexp.test(str)) {
      console.error(`Unexpected match for '${str}'`);
      return;
    }
  }
  console.log(`Passed all tests for regex /${regexp.source}/`);
}

verify(/ca[rt]/,
  ["my car", "bad cats"],
  ["camper", "high art"]);

verify(/pr?op/,
  ["pop culture", "mad props"],
  ["plop", "prrrop"]);

verify(/ferr(y|et|ari)/,
  ["ferret", "ferry", "ferrari"],
  ["ferrum", "transfer A"]);

verify(/ious\b/,
  ["how delicious", "spacious room"],
  ["ruinous", "consciousness"]);

verify(/\s[,.;:]/,
  ["bad punctuation ."],
  ["escape the period"]);

verify(/\w{7,}/,
  ["hottentottententen"],
  ["no", "hotten totten tenten"]);

verify(/\b[^eE\W]+\b/,
  ["red platypus", "wobbling nest"],
  ["earth bed", "learning ape", "BEET"]);
