function continueToGame() {
            $(".username-container").hide();
            $(".game-container").fadeIn("slow").show();
          
        }


            var game = new GameManager(message.cells);
            var direction;
            document.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 39: direction = "LEFT"; break;
                    case 38: direction = "UP"; break;
                    case 37: direction = "RIGHT"; break;
                    case 40: direction = "DOWN"; break;
                }
                game.pushStack();
                game.handler(direction);
            };
            document.getElementById("undo").addEventListener("click", function (e) {
                game.makeUndo();
            });




        function GameManager(cells) {
            this.cells = cells;
            this.setup();

        }

        GameManager.prototype.setup = function () {
            this.score = 0;
            this.tileContainer = document.querySelector(".tile-container");
            this.isAvailable = [];
            this.index = [];
            this.undoStack = [];
            this.tiles = [];
            for (var i = 0; i < 4; i++) {
                this.index[i] = [];
                for (var j = 0; j < 4; j++) {
                    this.index[i][j] = 0;
                }
                this.index[2][2] = 2;
                alert('fdsf');
            }

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

            this.render();


        }

        GameManager.prototype.render = function () {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    this.tiles[this.index[i][j]] = document.createElement("div");
                    this.tiles[this.index[i][j]].className = "tile";
                    this.tileContainer.appendChild(this.tiles[this.index[i][j]]);
                    var value = this.cells[this.index[i][j]].value;
                    console.log(this.colorHex["v8"]);
                    $(this.tiles[this.index[i][j]]).css("background", this.colorHex[`v${value}`]);
                    if (value != 0) {
                        this.tiles[this.index[i][j]].innerHTML = value;

                    } else {
                      this.tiles[this.index[i][j]].innerHTML = "";
                    }
                    var x = 10;
                    var y = 10;
                    x += 110 * j;
                    y += 110 * i;
                    $(this.tiles[this.index[i][j]]).css("left", `${x}px`);
                    $(this.tiles[this.index[i][j]]).css("top", `${y}px`);
                }

            }

        }

        GameManager.prototype.handler = function (direction) {
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

            this.move(row, col, direction, state);            
            $("#score").html("Score<br>" + this.score);
            this.checkGameOver();
            if (state.changed == 1) {
                this.collectAvailableCells();
                this.addNewNumber();

            }
        }

        GameManager.prototype.move = function (row, col, direction, state) {
            while (true) {
                var currentRow = row;
                var currentCol = col;
                while (true) {
                    if (currentRow > 3 || currentRow < 0 || currentCol > 3 || currentCol < 0) {
                        break;

                    }
                    var current = this.cells[this.index[currentRow][currentCol]];

                    var nextRow = currentRow + this.map[direction].row;
                    var nextCol = currentCol + this.map[direction].col;
                    if (nextRow > 3 || nextRow < 0 || nextCol > 3 || nextCol < 0) {
                        break;

                    }
                    while (true) {

                        var next = this.cells[this.index[nextRow][nextCol]];
                        if (next.value == 0) {
                            nextRow += this.map[direction].row;
                            nextCol += this.map[direction].col;
                            if (nextRow > 3 || nextRow < 0 || nextCol > 3 || nextCol < 0) {
                                break;

                            }
                        } else if (next.value == current.value) {
                            current.value <<= 1;
                            next.value = 0;
                            this.score += current.value;
                            this.updatePosition(currentRow, currentCol, nextRow, nextCol, current.value);
                            state.changed = 1;
                            break;

                        } else {
                            if (current.value == 0 && next.value != 0) {
                                current.value = next.value;
                                next.value = 0;
                                this.updatePosition(currentRow, currentCol, nextRow, nextCol, current.value);
                                state.changed = 1;
                                currentRow -= this.map[direction].row;
                                currentCol -= this.map[direction].col;
                                break;
                            } else if (current.value != 0) {
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

        GameManager.prototype.updatePosition = function (currentRow, currentCol, nextRow, nextCol, value) {
            var currentTile = this.tiles[this.index[currentRow][currentCol]];
            var nextTile = this.tiles[this.index[nextRow][nextCol]];
            var clone = nextTile.cloneNode(true);
            nextTile.innerHTML = "";
            $(nextTile).css("background", "none");
            var colorHex = this.colorHex[`v${value}`];
            this.tileContainer.appendChild(clone);
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

        GameManager.prototype.checkGameOver = function () {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (i - 1 >= 0) {
                        if (this.cells[this.index[i - 1][j]] == this.cells[this.index[i][j]]) {
                            return false;

                        }

                    }
                    if (i + 1 < 4) {
                        if (this.cells[this.index[i + 1][j]] == this.cells[this.index[i][j]]) {
                            return false;

                        }

                    }
                    if (j - 1 >= 0) {
                        if (this.cells[this.index[i][j - 1]] == this.cells[this.index[i][j]]) {
                            return false;

                        }
                    }
                    if (j + 1 < 4) {
                        if (this.cells[this.index[i][j + 1]] == this.cells[this.index[i][j]]) {
                            return false;

                        }
                    }
                    if (this.cells[this.index[i][j]]) {
                        return false;

                    }
                }
            }
            return true;
        }

        GameManager.prototype.collectAvailableCells = function () {
            for (var i = 0; i < 16; i++) {
                if (this.cells[i].value == 0) {
                    this.isAvailable.push(this.cells[i]);
                }
            }
        }

        GameManager.prototype.addNewNumber = function () {
            var i = Math.floor(Math.random() * (this.isAvailable.length - 1));
            var index = this.cells.indexOf(this.isAvailable[i]);
            var value = Math.random() < 0.9 ? 2 : 4;
            this.isAvailable[i].value = value;
            var newTile = this.tiles[index];
            $(newTile).addClass("new-tile");
            $(newTile).css("background", this.colorHex[`v${value}`]);
            newTile.innerHTML = value;
            setTimeout(function () {
                $(newTile).removeClass("new-tile");
            }, 100);
            while (this.isAvailable.length > 0) {
                this.isAvailable.pop();
            }

        }


        GameManager.prototype.pushStack = function () {
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++) {
                    this.undoStack.push(this.cells[this.index[row][col]].value);
                }
            }
            this.undoStack.push(this.score);
        }

        GameManager.prototype.makeUndo = function () {
            if (this.undoStack.length > 0) {
                console.log(this.undoStack);
                this.score = this.undoStack.pop();
                $("#score").html("Score<br>" + this.score);
                for (var row = 3; row >= 0; row--) {
                    for (var col = 3; col >= 0; col--) {
                        var item = this.undoStack.pop();
                        this.cells[this.index[row][col]].value = item;
                    }
                }
                while (this.tiles.length > 0) {
                    $(this.tiles.pop()).remove();
                }
                this.render();
            }          
        }
