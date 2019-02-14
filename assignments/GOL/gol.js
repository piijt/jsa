'use strict';

let gridHeight = 400;
let gridWidth = 400;
let theGrid = createArray(gridWidth);
let mirrorGrid = createArray(gridWidth);

// window.onload(function() {
//   tick();
// })


fillRandom(); //create the starting state for the grid by filling it with random cells
tick();

function tick() {
  drawGrid();
  updateGrid();
  requestAnimationFrame(tick);
}

function createArray(cells) { //creates a 2 dimensional array
  let arr = [];
  for (let i = 0; i < cells; i++) {
        arr[i] = [];
  }
  return arr;
}

function fillRandom() { //fill the grid randomly
  for (let j = 0; j < gridHeight; j++) { //iterate through rows
    for (let k = 0; k < gridWidth; k++) { //iterate through columns
        let rawRandom = Math.random(); //get a raw random number
        let improvedNum = (rawRandom * 5); //convert it to an int
        let randomBinary = Math.floor(improvedNum);
          if (randomBinary === 1) {
              theGrid[j][k] = 1;
        } else {
              theGrid[j][k] = 0;
      }
    }
  }
}

  function drawGrid() { //draw the contents of the grid onto a canvas
      let c = document.getElementById("gol");
      let ctx = c.getContext("2d");

      ctx.clearRect(0, 0, 400, 400); //this should clear the canvas ahead of each redraw
    for (let j = 1; j < gridHeight; j++) { //iterate through rows
      for (let k = 1; k < gridWidth; k++) { //iterate through columns
        if (theGrid[j][k] === 1) {
                ctx.fillStyle = "yellow";
                ctx.fillRect(j, k, 1, 1, 'black');
        }
      }
    }
  }

function updateGrid() { //perform one iteration of grid update
    for (let j = 1; j < gridHeight - 1; j++) { //iterate through rows
      for (let k = 1; k < gridWidth - 1; k++) { //iterate through columns
        let totalCells = 0;
        //add up the total values for the surrounding cells
        totalCells += theGrid[j - 1][k - 1]; //top left
        totalCells += theGrid[j - 1][k]; //top center
        totalCells += theGrid[j - 1][k + 1]; //top right

        totalCells += theGrid[j][k - 1]; //middle left
        totalCells += theGrid[j][k + 1]; //middle right

        totalCells += theGrid[j + 1][k - 1]; //bottom left
        totalCells += theGrid[j + 1][k]; //bottom center
        totalCells += theGrid[j + 1][k + 1]; //bottom right
        //apply the rules to each cell
        if (theGrid[j][k] === 0) {
          switch (totalCells) {
              case 3:
                  mirrorGrid[j][k] = 1; //if cell is dead and has 3 neighbours, switch it on
                  break;
              default:
                  mirrorGrid[j][k] = 0; //otherwise leave it dead
          }
        } else if (theGrid[j][k] === 1) { //apply rules to living cell
            switch (totalCells) {
              case 0:
              case 1:
                  mirrorGrid[j][k] = 0; //die of lonelines
                  break;
              case 2:
              case 3:
                  mirrorGrid[j][k] = 1; //carry on(my waywards son) living
                  break;
              case 4:
              case 5:
              case 6:
              case 7:
              case 8:
                  mirrorGrid[j][k] = 0; //die of overcrowding
                  break;
              default:
                  mirrorGrid[j][k] = 0; // ded
            }
          }
        }
      }

  for (let j = 0; j < gridHeight; j++) { //iterate through rows
    for (let k = 0; k < gridWidth; k++) { //iterate through columns
      theGrid[j][k] = mirrorGrid[j][k];
    }
  }
}
