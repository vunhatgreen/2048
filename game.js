var tileContainer = document.querySelector(".tile-container");
var values = [];
var tiles = [];
var score = [];
var stack = [];
var colorHex = {
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
            "v1024": "#F3904F",
            "v2048": "#8080FF"
};

var map = {
                'UP': { row: 1, col: 0, x: 1, y: 0 },
                'LEFT': { row: 0, col: -1, x: 0, y: 1 },
                'DOWN': { row: -1, col: 0, x: 1, y: 0 },
                'RIGHT': { row: 0, col: 1, x: 0, y: 1 }
};

setup();
addRandom();
addRandom();
render();


function setup() {
    for(var x = 0; x < 4; x++) {
        values[x] = [];
        for(var y = 0; y < 4; y++) values[x][y] = 0;
    }
}

function render(){
  for (var i = 0; i < 4; i++) {
      tiles[i] = [];
      for (var j = 0; j < 4; j++) {
          tiles[i][j] = document.createElement("div");
          $(tiles[i][j]).addClass("tile");
          this.tileContainer.appendChild(tiles[i][j]);
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
  var row;
  var col;
            var state = { changed: 0 };

            switch (direction) {
                case 'UP':
                    row = 0;
                    col = 0;
                    break;
                case 'LEFT':
                    row = 0;
                    col = 3;
                    break;
                case 'DOWN':
                    row = 3;
                    col = 0;
                    break;
                case 'RIGHT':
                    row = 0;
                    col = 0;
                    break;
            }

            move(row, col, direction, state);            
            $("#score").html("SCORE<br>" + this.score);
}

function move(row, col, direction, state){
  while (true) {
                var currentRow = row;
                var currentCol = col;
                while (true) {
                    if (currentRow > 3 || currentRow < 0 || currentCol > 3 || currentCol < 0) {
                        break;

                    }
                    var current = this.values[currentRow][currentCol];

                    var nextRow = currentRow + this.map[direction].row;
                    var nextCol = currentCol + this.map[direction].col;
                    if (nextRow > 3 || nextRow < 0 || nextCol > 3 || nextCol < 0) {
                        break;

                    }
                    while (true) {

                        var next = this.values[nextRow][nextCol];
                        if (next == 0) {
                            nextRow += this.map[direction].row;
                            nextCol += this.map[direction].col;
                            if (nextRow > 3 || nextRow < 0 || nextCol > 3 || nextCol < 0) {
                                break;

                            }
                        } else if (next == current) {
                            current <<= 1;
                            next = 0;
                            score += current;
                            updatePosition(currentRow, currentCol, nextRow, nextCol, current);
                            state.changed = 1;
                            break;

                        } else {
                            if (current == 0 && next != 0) {
                                current = next;
                                next = 0;
                                updatePosition(currentRow, currentCol, nextRow, nextCol, current);
                                state.changed = 1;
                                currentRow -= this.map[direction].row;
                                currentCol -= this.map[direction].col;
                                break;
                            } else if (current != 0) {
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
                "transition-timing-function": "linear",
            });

            setTimeout(function () {
                $(clone).remove();                
                currentTile.innerHTML = value;
                $(currentTile).css("background", colorHex);

            }, 200);
}
