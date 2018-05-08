var tileContainer = document.querySelector(".tile-container");
var values = [];
var tiles = [];
var score = 0;
var stack = [];
var didUndo = false;
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
        tiles[x] = [];
        for(var y = 0; y < 4; y++) {values[x][y] = 0;}
    }
}

function render(){
  for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        tiles[i][j] = document.createElement("div");
    tiles[i][j].className = "tile";
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

function setTile(x, y) {
    $(tiles[x][y]).css("background", this.colorHex[`v${values[x][y]}`]);
    console.log(values[x][y]);
    $(tiles[x][y]).addClass("new-tile");
    $(tiles[x][y]).html(values[x][y]);
    setTimeout(function () {
        $(tiles[x][y]).removeClass("new-tile");
    }, 200);
}

function addRandom() {
     do {
        var x = Math.floor(Math.random() * 4);
        var y = Math.floor(Math.random() * 4);
    } while (values[x][y])
    values[x][y] = Math.random() < 0.9 ? 2 : 4;
    setTile(x, y);
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
    if (state.changed == 1){
        didUndo = false;
        addRandom();
        pushStack();
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
                        score += values[currentRow][currentCol];
                        values[nextRow][nextCol] = 0;
                        updatePosition(currentRow, currentCol, nextRow, nextCol, values[currentRow][currentCol]);
                        state.changed = 1;
                        break;

                    } else {
                        if (values[currentRow][currentCol] == 0 && values[nextRow][nextCol]!= 0) {
                            values[currentRow][currentCol] = values[nextRow][nextCol];
                            values[nextRow][nextCol] = 0;
                            updatePosition(currentRow, currentCol, nextRow, nextCol, values[currentRow][currentCol]);
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


function pushStack() {
    for(var x = 0; x < 4; x++) for(var y = 0; y < 4; y++) stack.push(values[x][y]);
    stack.push(score);
}

function makeUndo() {
    if(!didUndo) stack.splice(-17,17);
    score = stack.pop();
    $("#score").html("Score<br>" + score);
    for(var x = 3; x >= 0; x--) for(var y = 3; y >= 0; y--){
        values[x][y] = stack.pop();
        setTile(x, y);
    }
    didUndo = true;
}



document.addEventListener("DOMContentLoaded", function() {
  setup();
  addRandom();
  addRandom();
  pushStack();
  render();
});


document.onkeydown = function(e) {
    switch(e.keyCode){
        case 37: handler("RIGHT"); break;
        case 38: handler("UP");    break;
        case 39: handler("LEFT");  break;
        case 40: handler("DOWN");  break;
    }
}

$('#undo').click(function(){
    makeUndo();
});