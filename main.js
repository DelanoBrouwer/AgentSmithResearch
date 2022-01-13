class Cell {
  constructor(gridX, gridY) {
    // Store the position of this cell in the grid
    this.gridX = gridX;
    this.gridY = gridY;

    // Make random cells alive
    this.alive = Math.random() > 0.920;
  }
}

class GameWorld {

  static numColumns = 500;
  static numRows = 100;

  constructor() {
    this.grid = [];

    this.createGrid();
    this.gameLoop();
  }

  createGrid() {
    for (let x = 0; x < GameWorld.numColumns; x++) {
      this.grid.push([]);
      for (let y = 0; y < GameWorld.numRows; y++) {
        this.grid[x].push(new Cell(x, y));
      }
    }
  }

  isAlive(x, y) {
    if (x < 0 || x >= GameWorld.numColumns || y < 0 || y >= GameWorld.numRows) {
      return 0;
    }

    return this.grid[x][y].alive ? 1 : 0;
  }

  async checkSurrounding() {
    // Loop over all cells
    let copy = this.grid;
    for (let x = 0; x < GameWorld.numColumns; x++) {
      for (let y = 0; y < GameWorld.numRows; y++) {

        // Count the nearby population
        let numAlive = 
          await this.isAlive(x - 1, y - 1) + 
          this.isAlive(x, y - 1) + 
          this.isAlive(x + 1, y - 1) + 
          this.isAlive(x - 1, y) + 
          this.isAlive(x + 1, y) + 
          this.isAlive(x - 1, y + 1) + 
          this.isAlive(x, y + 1) + 
          this.isAlive(x + 1, y + 1);

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
          else if (this.grid[x][y].alive == false){
            result = result + "┼";
          }
          else {result = result + "O"}
        }
        result = result + "\n";
      }
      console.clear();
      console.log(result);
      
      // Check the surrounding of each cell
      await this.checkSurrounding().then(await this.sleep(1500)).then(this.gameLoop());
    }
  }

let gameWorld = new GameWorld('canvas');
