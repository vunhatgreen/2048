var tileContainer = document.querySelector(".tile-container");
var values = [];
var tiles = [];
var score = 0;
var stack = [];
this.colorHex = {
            "v0": "#D2D2C8",
            "v2": "#FA5252",
            "v4": "#607BB0",
            "v8": "#9FE660",
            "v16": "#E6D960",
            "v32": "#C77070",
            "v64": "#4DA6FF",
            "v128": "#FF0000",
            "v256": "#967FF9",
            "v512": "#000080",
            "v1024": "#f3904f",
            "v2048": "#8080ff"
};

this.map = {
                'UP': { row: 1, col: 0, x: 1, y: 0 },
                'LEFT': { row: 0, col: -1, x: 0, y: 1 },
                'DOWN': { row: -1, col: 0, x: 1, y: 0 },
                'RIGHT': { row: 0, col: 1, x: 0, y: 1 }
            };
function setup() {
    for(var x = 0; x < 4; x++) {
        values[x] = [];
        for(var y = 0; y < 4; y++) {values[x][y] = 0;}
    }
}

function render(){
  for (var i = 0; i < 4; i++) {
      tiles[i] = [];
      for (var j = 0; j < 4; j++) {
          tiles[i][j] = document.createElement("div");
          tiles[i][j].className = "tile";
          console.log(tiles[i][j]);
          tileContainer.appendChild(tiles[i][j]);
          var value = values[i][j];
          $(tiles[i][j]).css("background", this.colorHex[`v${value}`]);
          if (value != 0) {
              tiles[i][j].innerHTML = value;
          } else {
              tiles[i][j].innerHTML = "";
          }
          var x = 110 * j + 10;
          var y = 110 * i + 10;
          $(tiles[i][j]).css("left", `${x}px`);
          $(tiles[i][j]).css("top", `${y}px`);
      }
  }
}

function addRandom() {
     do {
        var x = Math.floor(Math.random() * 4);
        var y = Math.floor(Math.random() * 4);
    } while (values[x][y])
    values[x][y] = Math.random() < 0.9 ? 2 : 4;
}


function handler(direction){
            var state = { changed: 0 };
            switch (direction) {
                case 'UP':
                    move(0, 0, direction, state);            
                    break;
                case 'LEFT':
                    move(0, 3, direction, state); 
                    break;
                case 'DOWN':
                    move(3, 0, direction, state); 
                    break;
                case 'RIGHT':
                    move(0, 0, direction, state); 
                    break;
            }

            $("#score").html("SCORE<br>" + this.score);
}

function move(row, col, direction, state) {
   while (row < 4 || col < 4) {
                var currentRow = row;
                var currentCol = col;
                while ((currentRow >= 0 && currentRow <= 3) && (currentCol >= 0 && currentCol <= 3)) {
                    var nextRow = currentRow + this.map[direction].row;
                    var nextCol = currentCol + this.map[direction].col;
                 
                    while ((nextRow >= 0 && nextRow <= 3) && (nextCol >= 0 && nextCol <= 3)) {
                        console.log(nextRow + " " + nextCol);
                        console.log(values[nextRow][nextCol]);
                        if (values[nextRow][nextCol] == 0) {
                            nextRow += this.map[direction].row;
                            nextCol += this.map[direction].col;
                    
                        } else if (values[nextRow][nextCol] == values[currentRow][currentCol]) {
                            values[currentRow][currentCol] <<= 1;
                            values[nextRow][nextCol] = 0;
                            this.updatePosition(currentRow, currentCol, nextRow, nextCol, values[currentRow][currentCol]);
                            state.changed = 1;
                            break;

                        } else {
                            if (values[currentRow][currentCol] == 0 && values[nextRow][nextCol]!= 0) {
                                values[currentRow][currentCol] = values[nextRow][nextCol];
                                values[nextRow][nextCol] = 0;
                                this.updatePosition(currentRow, currentCol, nextRow, nextCol, values[currentRow][currentCol]);
                                state.changed = 1;
                                currentRow -= this.map[direction].row;
                                currentCol -= this.map[direction].col;
                                break;
                            } else if (values[currentRow][currentCol] != 0) {
                                break;

                            }
                        }

                    }
                    currentRow += this.map[direction].row;
                    currentCol += this.map[direction].col;


                }
                row += this.map[direction].y;
                col += this.map[direction].x;

                if (row > 3 || row < 0) {
                    console.log("break");
                    break;

                }
                if (col > 3 || col < 0) {
                    break;

                }
            }
}



function updatePosition(currentRow, currentCol, nextRow, nextCol, value){
  var currentTile = tiles[currentRow][currentCol];
  var nextTile = tiles[nextRow][nextCol];
  var clone = nextTile.cloneNode(true);
  nextTile.innerHTML = "";
            $(nextTile).css("background", "none");
            var colorHex = this.colorHex[`v${value}`];
            tileContainer.appendChild(clone);
            $(clone).animate({
                "left": `${$(currentTile).css("left")}`,
                "top": `${$(currentTile).css("top")}`,
            });

            setTimeout(function () {
                $(clone).remove();                
                currentTile.innerHTML = value;
                $(currentTile).css("background", colorHex);

            }, 200);
}

document.addEventListener("DOMContentLoaded", function() {
  setup();
  addRandom();
  addRandom();
  render();
});



document.addEventListener("keydown", function(e) {
  console.log(e.keyCode);
  switch(e.key.toUpperCase()){
        case "D": handler("LEFT");  break;
        case "W": handler("UP");    break;
        case "A": handler("RIGHT"); break;
        case "S": handler("DOWN");  break;
    }

});