/**
  * Compare Robot Exercise
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

import * as Robot from "./robot.mjs";


// Write a function compareRobots that takes two robots (and their starting memory).
// It should generate 100 tasks and let each of the robots solve each of these
// tasks.
// When done, it should output the average number of steps each robot took per task.

function runRobot(state, robot, memory) {
  let totalTurns = 0;

  for (let turn = 0;; turn++) {
    if (state.parcels.length === 0) {
      totalTurns = turn;
      break;
    }
    let action = robot(state, memory);

    state = state.move(action.direction);
    memory = action.memory;
  }
  return totalTurns;
}


export function compareRobots(robot1, memory1, robot2, memory2) {
  let turns1 = [];
  let turns2 = [];

  for(let i=100;i>0;i--) {
    let state = Robot.VillageState.random(5);

    turns1.push(runRobot(state, robot1, memory1));
    turns2.push(runRobot(state, robot2, memory2));
  }
  console.log(`${robot1.name} took an average of ${Math.round(turns1.reduce((a,b) => a+b) / turns1.length)} turns`);
  console.log(`${robot2.name} took an average of ${Math.round(turns2.reduce((a,b) => a+b) / turns2.length)} turns`);
}


// compareRobots( Robot.routeRobot, [], Robot.goalOrientedRobot, []);
