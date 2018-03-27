var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scoreLabel = document.getElementById('score');

var pos = [];
var stack = [];
var score = 0;
var cellSize = 85;
var lose = false;

run();

function run() {
    createCell();
    pushNumCell();
    pushNumCell();
}


function render(){
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            drawCell(pos[i][j]);
            stack.push(pos[i][j]);
        }
    }
 }




function cell(x,y) {
    this.x = x * cellSize + 12 * (x + 1);
    this.y = y * cellSize + 12 * (y + 1);
    this.value = 0;
}

function createCell() {
    for(var i = 0; i < 4; i++) {
        pos[i] = [];
        for(var j = 0; j < 4; j++) {
            pos[i][j] = new cell(i,j);
        }
    }
}

function drawCell(cell) {
    ctx.beginPath();
    ctx.rect(cell.x,cell.y,cellSize,cellSize);
    switch (cell.value) {
        case 0: ctx.fillStyle = "#EBEBE0"; break;
        case 2: ctx.fillStyle = "#FA5252"; break;
        case 4: ctx.fillStyle = "#607BB0"; break;
        case 8: ctx.fillStyle = "#9FE660"; break;
        case 16: ctx.fillStyle = "#E6D960"; break;
        case 32: ctx.fillStyle = "#C77070"; break;
        case 64: ctx.fillStyle = "#4DA6FF"; break;
        case 128: ctx.fillStyle = "#FF0000"; break;
        case 256: ctx.fillStyle = "#FF0000"; break;
        case 512: ctx.fillStyle = "#FF0000"; break;
        case 1024: ctx.fillStyle = "#FF0000"; break;
        case 2048: ctx.fillStyle = "#FF0000"; break;
        default: ctx.fillStyle = "#FFFFFF";
    }
    
    ctx.fill();
    var fontSize = cellSize / 2;
    
    if(cell.value) {
        ctx.font = cellSize/2 + 'px Consolas';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(cell.value, cell.x + cellSize / 2, cell.y + cellSize / 1.5);
    }
}


function pushNumCell() {
    while(true) {
        var value = 2;
        var row = Math.floor(Math.random() * 4);
        var col = Math.floor(Math.random() * 4);
        if(!pos[col][row].value) {
            pos[col][row].value = value;
            break;
        }
    }
    render();
}

function checkGame(isChange) {
    var hasEmpty = 0;
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            if(!pos[i][j].value) hasEmpty++;
        }
    }
    if(!hasEmpty) endGame();
    else if (isChange) pushNumCell();
}


document.onkeydown = function(e) {
    if(!lose) {
        if(e.keyCode == 37) left();
        else if(e.keyCode == 38) up();
        else if(e.keyCode == 39) right();
        else if(e.keyCode == 40) down();
        else if(e.keyCode == 32) undo();
        scoreLabel.innerHTML = score;        
    }
}

function left(){
    var isChange = false;
    for(var j = 0; j < 4; j++) {
        for(var i = 1; i < 4; i++) {
            if(pos[i][j].value) {
                var col = i;
                while(col > 0) {
                    if(!pos[col-1][j].value) {
                        pos[col-1][j].value = pos[col][j].value;
                        pos[col][j].value = 0;
                        col--;
                        isChange = true;
                    }
                    else if(pos[col-1][j].value == pos[col][j].value) {
                        pos[col-1][j].value *= 2;
                        pos[col][j].value = 0;
                        score += pos[col-1][j].value;
                        isChange = true;
                        break;
                    }
                    else break;
                }
            }
        }
    }
    checkGame(isChange);    
}
function up(){
    var isChange = false;
    for(var i = 0; i < 4; i++) {
        for(var j = 1; j < 4; j++) {
            if(pos[i][j].value) {
                var row = j;
                while(row > 0) {
                    if(!pos[i][row-1].value) {
                        pos[i][row-1].value = pos[i][row].value;
                        pos[i][row].value = 0;
                        row--;
                        isChange = true;
                    }
                    else if(pos[i][row-1].value == pos[i][row].value) {
                        pos[i][row-1].value *= 2;
                        pos[i][row].value = 0;
                        score += pos[i][row-1].value;
                        isChange = true;
                        break;
                    }
                    else break;
                }
            }
        }
    }
    checkGame(isChange);    

}
function right(){
    var isChange = false;
    for(var j = 0; j < 4; j++) {
        for(var i = 2; i >= 0; i--) {
            if(pos[i][j].value) {
                var col = i;
                while(col < 3) {
                    if(!pos[col+1][j].value) {
                        pos[col+1][j].value = pos[col][j].value;
                        pos[col][j].value = 0;
                        col++;
                        isChange = true;
                    }
                    else if(pos[col+1][j].value == pos[col][j].value) {
                        pos[col+1][j].value *= 2;
                        pos[col][j].value = 0;
                        score += pos[col+1][j].value;
                        isChange = true;
                        break;
                    }
                    else break;
                }
            }
        }
    }
    checkGame(isChange);    
}
function down(){
    var isChange = false;
    for(var i = 0; i < 4; i++) {
        for(var j = 2; j >= 0; j--) {
            if(pos[i][j].value) {
                var row = j;
                while(row < 3) {
                    if(!pos[i][row+1].value) {
                        pos[i][row+1].value = pos[i][row].value;
                        pos[i][row].value = 0;
                        row++;
                        isChange = true;
                    }
                    else if(pos[i][row].value == pos[i][row+1].value) {
                        pos[i][row+1].value *= 2;
                        pos[i][row].value = 0;
                        score += pos[i][row+1].value;
                        isChange = true;
                        break;
                    }
                    else break;
                }
            }
        }
    }
    checkGame(isChange);    
}

function undo(){ //needtochange
    for(var i = 3; i >= 0; i--){
        for(var j = 3; j >= 0; j--) {
            pos[i][j] = stack.pop();
            drawCell(pos[i][j]);
        }    
    }
}



function endGame(){
    alert("YOU LOSE!");
    canvas.style.opacity = "0.5";
    lose = true;
}