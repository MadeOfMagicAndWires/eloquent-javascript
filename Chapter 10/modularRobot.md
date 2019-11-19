Modular Robot Exercise
======================

We already used modules for the Robot project in the exercise.

That said if we were to rewrite [robot.mjs](../Chapter 07/robot.mjs) into
a modular project we would create two or possibly three files:
+ One group related to VillageState; with the VillageState object and graph
  related functions.
+ One group related to robots; with runRobot and the various robot objects
+ Possibly, we could seperate the graph related functions into their own files
  but, as mentioned, there's plenty of graph related packages we could use as
  well
