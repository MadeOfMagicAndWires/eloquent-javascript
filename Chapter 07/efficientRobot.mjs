/**
  * Robot Efficiency Exercise
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

// Can you write a robot that finishes the delivery task faster than
// goalOrientedRobot?

import { compareRobots } from "./compareRobot.mjs";
import { roadGraph, findRoute, goalOrientedRobot } from "./robot.mjs";

// Almost got there
// did not know how to handle preferring routes with pick ups with this weird
// setup, so that part is based on the solution.
function efficientRobot({place, parcels}, route) {
  // calculates a route's weight; based on the solution
  function routeWeight({ plannedRoute, pickUp }) {
    return (pickUp ? 0.5 : 0) + plannedRoute.length;
  }

  if (route.length === 0) {
    let routes = [];

    for (let parcel of parcels) {
      if (parcel.place !== place) {
        routes.push({
          plannedRoute: findRoute(roadGraph, place, parcel.place),
          pickUp: true
        });
      } else {
        routes.push({
          plannedRoute: findRoute(roadGraph, place, parcel.address),
          pickUp: false
        });
      }
    }

    routes.sort((a,b) => routeWeight(a) - routeWeight(b));
    route = routes[0].plannedRoute;
  }
  return {direction: route[0], memory: route.slice(1)};
}



compareRobots( goalOrientedRobot, [], efficientRobot, []);
