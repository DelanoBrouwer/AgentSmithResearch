# AgentSmithResearch

This repository contains the results of my research for the Agent Smith project.

The goal of this research was to show whether the Moleculer Framework can actually be used for the improvement of the Agent Smith Simulator produced by TNO.

It is recommended to read the results document before consulting this repository.

Versions / Branches:
* Main - Contains the concept implementation which was mentioned in the results document.
* 1 - Single-threaded Game of Life.
* 2 - Game of Life using the Moleculer Microservices Framework.
* 3 - Version 2 but with slight adjustments so that we can check the execution times.
* 4 - Version 1 but with slight adjustments so that we can check the execution times.

## Technical Information
All versions of this program have been made using the Moleculer Framework and NodeJs.
To use any of these versions -- Concept.js excluded:
- Download the files for the version you want to run.
- Open the project and run `npm install`.
- If you're using Version 1 or 4, simply run node main.js
- - If you're running Version 2 or 3:
- - Run `node Golnode.js` **at least once**, you can run it in multiple terminals / consoles to start multiple nodes.
- - Perform the previous action for GolNode2.js **at least once**, it is recommended to run multiple nodes of GolNode2.js.
- - Finally, run `node main.js`

The program should now run succesfully.

## Known Bugs
- In version 2 and 3, running the program with a low amount of waiting time between each cycle (using the sleep function) can cause the game to display incorrectly, only updating the left side of the grid rather than the entire grid. No solution has been discovered for this problem.
- In version 2 and 3, running only one node containing GolNode2.js will crash the program as the request queue fills up and starts throwing errors. To avoid this, start at least 2 nodes containing GolNode2.js.
