const { ServiceBroker } = require("moleculer");

const transporter = process.env.TRANSPORTER || "TCP";

const broker = new ServiceBroker({
  namespace: process.env.NAMESPACE || "nodes",
  nodeID: process.env.nodeID || "node-" + process.pid,
  transporter,
  logger: [
    "Console",
  ],
  logLevel: process.env.LOGLEVEL || "warn",
  registry: {
    discoverer: {
      type: process.env.DISCOVERER || "Local",
      options: {
        serializer: process.env.DISCOVERER_SERIALIZER,
      },
    },
  },
});

broker.start().then(() => {
  broker.waitForServices(["Cell", "Neighbours"]).then(() => {

    class Cell {
      constructor(gridX, gridY) {
        // Store the position of this cell in the grid
        this.gridX = gridX;
        this.gridY = gridY;

        // Make random cells alive
        this.alive = Math.random() > 0.5;
      }

    }

    class GameWorld {

      static numColumns = 40;
      static numRows = 20;

      constructor() {
        this.grid = [];

        this.createGrid().then(() => { this.gameLoop() });
      }

      async createCell(x, y) {
        let echoX = await broker.call("Cell.Echo", { message: x });
        let echoY = await broker.call("Cell.Echo", { message: y });

        return new Cell(echoX, echoY);
      }

      async createGrid() {
        for (let x = 0; x < GameWorld.numColumns; x++) {
          this.grid.push([]);
          for (let y = 0; y < GameWorld.numRows; y++) {
            this.grid[x].push(await this.createCell(x, y));
          }
        }
      }

      async checkSurrounding() {
        // Loop over all cells
        let copy = this.grid;
        for (let x = 0; x < GameWorld.numColumns; x++) {
          for (let y = 0; y < GameWorld.numRows; y++) {

            // Count the nearby population
            broker.call("Neighbours.GetNumAlive", { x: x, y: y, numColumns: this.numColumns, numRows: this.numRows, grid: this.grid }).then((numAlive) => {

              if (numAlive == 2) {
                // Do nothing
                copy[x][y].alive = copy[x][y].alive;
              } else if (numAlive == 3) {
                // Make alive
                copy[x][y].alive = true;
              } else {
                // Make dead
                copy[x][y].alive = false;
              }
            })
          }
        }

        // Apply the new state to the cells
        this.grid = copy;
      }

      sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }

      async gameLoop() {
        let result = ""
        for (let y = GameWorld.numRows - 1; y >= 0; y--) {
          for (let x = 0; x < GameWorld.numColumns; x++) {
            if (this.grid[x][y].alive == true) {
              result = result + "█";
            }
            else if (this.grid[x][y].alive == false) {
              result = result + " ";
            }
            else { result = result + "O" }
          }
          result = result + "\n";
        }
        console.clear();
        console.log(result);

        // Check the surrounding of each cell
        await this.checkSurrounding().then(await this.sleep(2000)).then(this.gameLoop());
      }
    }

    new GameWorld('canvas');
  })
})