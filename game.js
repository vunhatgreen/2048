//VARIABLE

var tileContainer = document.querySelector(".tile-container");
var score = 0;
var stack = [];
var tiles = [];
var values = [];
var didUndo = false;
this.colorHex = {
            "v0":    "#D2D2C8",
            "v2":    "#FA5252",
            "v4":    "#607BB0",
            "v8":    "#9FE660",
            "v16":   "#E6D960",
            "v32":   "#C77070",
            "v64":   "#4DA6FF",
            "v128":  "#FF0000",
            "v256":  "#967FF9",
            "v512":  "#000080",
            "v1024": "#f3904f",
            "v2048": "#8080ff"
};

this.map = {
                'UP':    { row: 1, col: 0, x: 1, y: 0  },
                'LEFT':  { row: 0, col: -1, x: 0, y: 1 },
                'DOWN':  { row: -1, col: 0, x: 1, y: 0 },
                'RIGHT': { row: 0, col: 1, x: 0, y: 1  }
            };

document.addEventListener("DOMContentLoaded", function() {
  setup();
  addRandom();
  addRandom();
  pushStack();
  render();
});

//SETUP AND RENDER

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
            tiles[i][j].innerHTML = (value != 0) ? value : "";
            var x = 110 * j + 10;
            var y = 110 * i + 10;
            $(tiles[i][j]).css("left", `${x}px`);
            $(tiles[i][j]).css("top", `${y}px`);
        }
    }
}

//CREATE TILE

function addRandom() {
     do {
        var x = Math.floor(Math.random() * 4);
        var y = Math.floor(Math.random() * 4);
    } while (values[x][y])
    values[x][y] = Math.random() < 0.9 ? 2 : 4;
    setTile(x, y);
}

function setTile(x, y) {
    $(tiles[x][y]).css("background", this.colorHex[`v${values[x][y]}`]);
    $(tiles[x][y]).addClass("new-tile");
    $(tiles[x][y]).html(values[x][y]);
    setTimeout(function () {
        $(tiles[x][y]).removeClass("new-tile");
    }, 150);
}

//SET TILE POSITION

function handler(direction) {
    var state = { changed: false };
            switch (direction) {
                case 'UP':      move(0, 0, direction, state); break;
                case 'LEFT':    move(0, 3, direction, state); break;
                case 'DOWN':    move(3, 0, direction, state); break;
                case 'RIGHT':   move(0, 0, direction, state); break;
            }
    if (state.changed){
        didUndo = false;
        addRandom();
        checkGameOver();
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
                    if (values[nextRow][nextCol] == 0) {
                        nextRow += this.map[direction].row;
                        nextCol += this.map[direction].col;
                
                    } else if (values[nextRow][nextCol] == values[currentRow][currentCol]) {
                        values[currentRow][currentCol] <<= 1;
                        score += values[currentRow][currentCol];
                        values[nextRow][nextCol] = 0;
                        updatePosition(currentRow, currentCol, nextRow, nextCol, values[currentRow][currentCol]);
                        state.changed = true;
                        break;

                    } else {
                        if (values[currentRow][currentCol] == 0 && values[nextRow][nextCol]!= 0) {
                            values[currentRow][currentCol] = values[nextRow][nextCol];
                            values[nextRow][nextCol] = 0;
                            updatePosition(currentRow, currentCol, nextRow, nextCol, values[currentRow][currentCol]);
                            state.changed = true;
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
                "top":  `${$(currentTile).css("top")}`,
            }, 100);

            setTimeout(function () {
                $(clone).remove();                
                currentTile.innerHTML = value;
                $(currentTile).css("background", colorHex);

            }, 100);
}

//UNDO FEATURE

function pushStack() {
    for(var x = 0; x < 4; x++) for(var y = 0; y < 4; y++) stack.push(values[x][y]);
    stack.push(score);
}

function makeUndo() {
    if(stack.length > 0) {
        if(!didUndo) {
            stack.splice(-17,17);  
            didUndo = true;
        } 
        score = stack.pop();
        $("#score").html("SCORE<br>" + score);
        for(var x = 3; x >= 0; x--) for(var y = 3; y >= 0; y--) values[x][y] = stack.pop();
        render();
    } else pushStack();
}

//CHECK ENDGAME

function checkGameOver() {
    if(isEnd()) $("#title").html('END!');
}

function isEnd() {
    var counter = 0;
    for(var x = 0; x < 4; x++) for(var y = 0; y < 4; y++) if(values[x][y] != 0) counter++;
    if(counter == 16){
        counter = 0;
        for(var x = 0; x < 4; x++) for(var y = 0; y < 4; y++) {
            var a = ((x+1) < 4) ? values[x+1][y] : 0;
            var b = ((x-1) >= 0) ? values[x-1][y] : 0;
            var c = ((y+1) < 4) ? values[x][y+1] : 0;
            var d = ((y-1) >= 0) ? values[x][y-1] : 0;
            if(![a, b, c, d].includes(values[x][y])) counter++;
        }
    }
    return (counter == 16) ? true : false; 
}

//KEYBOARD AND MOUSE CONTROLLER

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