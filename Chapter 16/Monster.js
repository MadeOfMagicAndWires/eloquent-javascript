/*
 * Monster Exercise
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

/* eslint-disable no-undef, no-unused-vars */


// It is traditional for platform games to have enemies that you can jump on
// top of to defeat. This exercise asks you to add such an actor type to the
// game.
//
// Monsters move only horizontally.
// You can make them move in the direction of the player, bounce back and forth
// like horizontal lava, or have any movement pattern you want.
//
// When a monster touches the player, the effect depends on whether the player
// is jumping on top of them or not.
// You can approximate this by checking whether the player’s bottom is near the
// monster’s top. If this is the case, the monster disappears.
// If not, the game is lost.

const LEVEL =`
..................................
.################################.
.#..............................#.
.#..............................#.
.#..............................#.
.#...........................o..#.
.#..@...........................#.
.##########..............########.
..........#..o..o..o..o..#........
..........#...........M..#........
..........################........
..................................
`;

/**
 *
 * Creates a Monster actor class that can kill or be killed by the player on
 * contact.
 *
 * @param {Vec} pos - the current position of the actor within the level
 * @param {Vec} speed - the speed and direction of movement of the actor
 * @return {Monster} - the actor with the set attributes
 *
 */
const monsterSpeed = 4;

class Monster {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get size() {
    return new Vec(1.2, 1);
  }

  get type() {
    return "monster";
  }

  static create(pos, speed) {
    return new Monster(pos.plus(new Vec(0, -1)), monsterSpeed);
  }

  collide(state) {
    // landed on top; kill monster
    if((state.player.pos.y + state.player.size.y) < this.pos.y + this.size.y) {
      let actors = state.actors.filter(a => a !== this);

      return new State(state.level, actors, state.status);
    } else { // player did not jump hard enough, kill him
      return new State(state.level, state.actors, "lost");
    }
  }

  update(time, state) {
    let newPos = new Vec(this.pos.x + (this.speed * time), this.pos.y);

    // actor can move to set position, so do
    if(!state.level.touches(newPos, this.size, "wall")) {
      return new Monster(newPos, this.speed);
    } else { // cannot move here; turn the other way
      console.log("Bump");
      return new Monster(this.pos, (this.speed * -1));
    }
  }
}

levelChars.M = Monster;
