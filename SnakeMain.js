// JavaScript source code
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Constants
const SQUARES_DIVISION_AMOUNT = 30; //Amount to divide the various squares by
const CANVAS_WIDTH = canvas.width; //width of canvas
const CANVAS_HEIGHT = canvas.height; //canvas height
const SHOW_GRID = false;
const TEXT_FADE_TIME = 2.5;
const SAVE_KEY_SCORE = "Snakehighscore";
const MOVE_DIRECTION = {
    none: 0,
    left: 1,
    right: 2,
    up: 3,
    down: 4
}
const OBJECT_TYPE = {
    snakehead: 0,
    food: 1,
    snakebody: 2
}

const GAME_STATE = {
    MainMenu: 0,
    Running: 1,
    Paused: 2,
    Defeated: 3
}

//-------------------World game classes ----------------
class SnakeHead {
    constructor(start) {
        this.gridposition = start;
        this.oldgrid = { x: this.gridposition.x, y: this.gridposition.y };
        this.movedirection = MOVE_DIRECTION.none;
        this.snakeBodyParts = [];

    }


    updateMoveDirection(newMoveDirection) {
        this.movedirection = newMoveDirection;
        this.updateNewMove();
    }

    updateNewMove() {
        if (this.movedirection === MOVE_DIRECTION.none) {
            return;
        }
        var pixelloc = getGridXYPixelLocation(this.gridposition.x, this.gridposition.y);
        var div10 = widthdiv / 10;
        //console.log("before grid x = " + this.gridposition.x);
        //Clear previous grid location
        ctx.clearRect(pixelloc.x + div10, pixelloc.y + (heightdiv / 10), widthdiv - div10, heightdiv - div10)
        //process new move

        //-------------Check location we are moving to----------------------
        //In filledtiles array, it is keeping log of the snakeheads gridposition and updates itself automatically (huzzah for objects)
        //Find location we are moving to.
        var foundHit = false;
        var foundx = this.gridposition.x;
        var foundy = this.gridposition.y;

        var ternx = 0;
        var terny = 0;
        

        if (this.movedirection === MOVE_DIRECTION.left) {
            ternx = (this.gridposition.x - 1 < 0) ? SQUARES_DIVISION_AMOUNT - 1 : this.gridposition.x - 1;
            
            if (ContainsTileCoOrdinates(ternx, this.gridposition.y)) {
                    foundHit = true;
                    foundx = ternx;
                }
            
            
        }
        if (this.movedirection === MOVE_DIRECTION.right) {
            ternx = (this.gridposition.x + 1 > SQUARES_DIVISION_AMOUNT - 1) ? 0 : this.gridposition.x + 1;
            if (ContainsTileCoOrdinates(ternx, this.gridposition.y)) {
                foundHit = true;
                foundx=ternx;
            }
        }
        if (this.movedirection === MOVE_DIRECTION.up) {
            terny = (this.gridposition.y - 1 < 0) ? SQUARES_DIVISION_AMOUNT - 1 : this.gridposition.y -1;
            if (ContainsTileCoOrdinates(this.gridposition.x, terny)) {
                foundHit = true;
                foundy = terny;
            }
        }
        if (this.movedirection === MOVE_DIRECTION.down) {
            terny = (this.gridposition.y + 1 > SQUARES_DIVISION_AMOUNT - 1) ? 0 : this.gridposition.y + 1; 
            if (ContainsTileCoOrdinates(this.gridposition.x, terny)) {
                foundHit = true;
                foundy=terny;
            }
        }



        //Check what is in that location
        if (foundHit = true) {
            var foundObjectType = FilledTiles[getArrayIndexLocation(foundx, foundy)].objectType;
            switch (foundObjectType) {
                case 0:
                    break;
                case 1:
                    
                    var ternsnakebodyx = (this.snakeBodyParts.length < 1) ? this.gridposition.x : this.snakeBodyParts[this.snakeBodyParts.length - 1].gridposition.x;
                    var ternsnakebodyy = (this.snakeBodyParts.length < 1) ? this.gridposition.y : this.snakeBodyParts[this.snakeBodyParts.length - 1].gridposition.y;
                    score += 10 + (10 * SnakeBodyPart.length);
                    this.AddSnakeBody(ternsnakebodyx, ternsnakebodyy);
                    checkScore();
                    showScore();
                    moveFood();
                    break;
                case 2:
                    gameOver();
                    break;
            }
        }
        for (i = 0; i < FilledTiles.length; i++) {
            console.log("Tile object type is " + FilledTiles[i].objectType + " at x " + FilledTiles[i].position.x + " at y " + FilledTiles[i].position.y);
        }
       
        //console.log("snake head old grid x is " + this.oldgrid.x + " y " + this.oldgrid.y);

        this.oldgrid.x = this.gridposition.x;
        this.oldgrid.y = this.gridposition.y;

        //console.log("snake head new old grid x is " + this.oldgrid.x + " y " + this.oldgrid.y);

        //location is clear.  Move into location
        if (this.movedirection === MOVE_DIRECTION.left) {
            this.gridposition.x--;
        }
        if (this.movedirection === MOVE_DIRECTION.right) {
            this.gridposition.x++;
        }
        if (this.movedirection === MOVE_DIRECTION.up) {
            this.gridposition.y--;
        }
        if (this.movedirection === MOVE_DIRECTION.down) {
            this.gridposition.y++;
        }
        
        //Draw snakehead and last snakes
        this.draw();
        for (i = 0; i < this.snakeBodyParts.length; i++) {
            this.snakeBodyParts[i].updateNewMove();

        }

    }

    

    AddSnakeBody(x, y) {
        var followpart = (this.snakeBodyParts.length < 1) ? snakehead : this.snakeBodyParts[this.snakeBodyParts.length - 1];

        this.snakeBodyParts.push(new SnakeBodyPart({ x: x, y: y }, followpart));


        FilledTiles.push({ position: this.snakeBodyParts[this.snakeBodyParts.length - 1].gridposition, objectType: OBJECT_TYPE.snakebody });
        //this.snakeBodyParts[this.snakeBodyParts.length - 1].updateNewMove();
    }


    draw() {
        ctx.fillStyle = "black";

        

        if (this.gridposition.x < 0) {
            this.gridposition.x = SQUARES_DIVISION_AMOUNT - 1;
        }
        if (this.gridposition.x > SQUARES_DIVISION_AMOUNT - 1) {
            this.gridposition.x = 0;
        }
        if (this.gridposition.y < 0) {
            this.gridposition.y = SQUARES_DIVISION_AMOUNT - 1;
        }
        if (this.gridposition.y > SQUARES_DIVISION_AMOUNT - 1) {
            this.gridposition.y = 0;
        }
        var pixelloc = getGridXYPixelLocation(this.gridposition.x, this.gridposition.y);
        var div10 = widthdiv / 10;
        ctx.fillRect(pixelloc.x + div10, pixelloc.y + (heightdiv / 10), widthdiv - div10, heightdiv - div10);

        
        //Check tile
        

        /*if (FilledTiles.includes(this.gridposition)) {
            console.log("something here");
        }
        else {
            console.log("grid position empty");
        }
        for (this.i = 0; this.i < FilledTiles.length; this.i++) {
            console.log("filled tile x loc " + FilledTiles[this.i].x + " filled tiled y loc " + FilledTiles[this.i].y);
            console.log("snakehead x loc " + this.gridposition.x + "snakehead y loc " + this.gridposition.y);
        }*/


    }



}

class SnakeBodyPart {
    constructor(start,follow) {
        this.gridposition = start;
        this.followpart = follow;
        this.oldgrid = { x: this.followpart.gridposition.x, y: this.followpart.gridposition.y };
        this.filledtilesindex = FilledTiles.length;
    }

    updateNewMove() {

        //Clear current grid position to update new one.  Old grid position will be filled in with new snake body part
        var pixelloc = getGridXYPixelLocation(this.gridposition.x, this.gridposition.y);
        var div10 = widthdiv / 10;
        //console.log("clear from x " + this.oldgrid.x + " y " + this.oldgrid.y);
        //console.log("clearing from x " + (pixelloc.x + div10) + " y " + (pixelloc.y + (heightdiv / 10)) + " to width " + (widthdiv - div10) + " to height " + (heightdiv - div10));
        ctx.clearRect(pixelloc.x + div10, pixelloc.y + (heightdiv / 10), widthdiv - div10, heightdiv - div10)
        this.oldgrid = {
            x: this.gridposition.x, y: this.gridposition.y
        };

        this.gridposition = {
            x: this.followpart.oldgrid.x, y: this.followpart.oldgrid.y
        };
        FilledTiles[this.filledtilesindex].position = this.gridposition;
        this.draw();


        
    }

    draw() {
        ctx.fillStyle = "black";
        var pixelloc = getGridXYPixelLocation(this.gridposition.x, this.gridposition.y);
        var div10 = widthdiv / 10;
        ctx.fillRect(pixelloc.x + div10, pixelloc.y + (heightdiv / 10), widthdiv - div10, heightdiv - div10);
        //console.log("drawing from x " + this.gridposition.x + " y " + this.gridposition.y);
        //console.log("drawing from x " + (pixelloc.x + div10) + " y " + (pixelloc.y + (heightdiv / 10)) + " to width " + (widthdiv - div10) + " to height " + (heightdiv - div10));
        
    }

    
}

class Food {
    constructor(start) {
        this.gridposition = start;
        
    }
    draw() {
        ctx.fillStyle = "darkred";
        var div10 = widthdiv / 10;
        var pixelloc = getGridXYPixelLocation(this.gridposition.x, this.gridposition.y);
        ctx.fillRect(pixelloc.x + div10, pixelloc.y + (heightdiv / 10), widthdiv - div10, heightdiv - div10);
    }
        
}




//-------------------World game variables ----------------
var heightdiv = (canvas.height / SQUARES_DIVISION_AMOUNT);
var widthdiv = canvas.width / SQUARES_DIVISION_AMOUNT;

var snakestart = {
    x: 0,
    y: 1,
};

var foodPosition = {
    x: 5,
    y: 6,
}

var position1 = {
    x: 5,
    y: 5
};
var position2 = {
    x: 6,
    y: 6
};


var gamestate = GAME_STATE.MainMenu;

var snakehead = new SnakeHead({ x: 1, y: 1 });
var food = new Food(foodPosition);
var highScore, score;
//var snakebody = new SnakeBodyPart(snakestart);

var FilledTiles = [{ position: snakehead.gridposition, objectType: OBJECT_TYPE.snakehead }, { position: food.gridposition, objectType: OBJECT_TYPE.food } ];



//------------------- World game functions----------------
//Make grid
if (SHOW_GRID) {
    var k = 0;
    for (i = 0; i < SQUARES_DIVISION_AMOUNT; i++) {
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        var xloc = (widthdiv * i) + (widthdiv / 2);
        for (j = 0; j < SQUARES_DIVISION_AMOUNT; j++) {
            yloc = (heightdiv * j) + (heightdiv / 2);

            ctx.fillText(k, xloc, yloc);



            k++;
        }

        ctx.fillRect(0, ShiftGridPixelY(true, xloc), CANVAS_WIDTH, 1);
        ctx.fillRect(ShiftGridPixelX(false, xloc), 0, 1, CANVAS_HEIGHT);


    }
}


function getGridXYPixelLocation(x,y) {
    
    var pixelposition = {
        x: x * widthdiv,
        y: y * heightdiv,
    };
    return pixelposition;

}

function ShiftGridPixelX(xdirection, x) {
    if (xdirection == true) {
        return x = x - (widthdiv / 2);
    }
    else {
        return x = x + (widthdiv / 2);
    }
}

function ShiftGridPixelY(ydirection, y) {
    if (ydirection == true) {
        return y = y - (widthdiv / 2);
    }
    else {
        return y = y + (widthdiv / 2);
    }
}

function ContainsTileCoOrdinates(x, y) {
    for (this.i = 0; this.i < FilledTiles.length; this.i++) {
        if (FilledTiles[this.i].position.x == x && FilledTiles[this.i].position.y == y) {
            //console.log(true);
            return true;
        }
        
    }
    //console.log(false);
    return false;
}

//function only to be called if we know a tile is there
function getArrayIndexLocation(x, y) {
    for (this.i = 0; this.i < FilledTiles.length; this.i++) {
        if (FilledTiles[this.i].position.x == x && FilledTiles[this.i].position.y == y) {
            return i;
        }
        
    }
    return null;
}

//console.log(getArrayIndexLocation(4, 4));
//Move food
function moveFood() {
    console.log((Math.pow(SQUARES_DIVISION_AMOUNT, 2)) - 1);
    if (FilledTiles.length < (Math.pow(SQUARES_DIVISION_AMOUNT,2)) - 1) {

        do {
            var NewX = Math.floor(Math.random() * SQUARES_DIVISION_AMOUNT);
            var NewY = Math.floor(Math.random() * SQUARES_DIVISION_AMOUNT);
            
        }
        while (ContainsTileCoOrdinates(NewX, NewY));
        var NewGridPosition = {
            x: NewX,
            y: NewY,
        }
        
        food.gridposition = NewGridPosition;
        FilledTiles[1].position = NewGridPosition;
        food.draw();
    }
}


function gameBegin() {
    switch (gamestate) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
    }
    
}

function gameStart() {
    var scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
    highScore = (scoreStr == null) ? 0 : parseInt(scoreStr);
    score = 0;
    gameDraw();
}

function checkScore() {
    //console.log("checking score");
    if (score > highScore) {
        //console.log("score bigger than highscore");
        highScore = score;
        localStorage.setItem(SAVE_KEY_SCORE, highScore);
    }
    else {
        //console.log("score smaller than highscore");
    }
    
}

function gameOver() {
    console.log("game over");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    snakehead = new SnakeHead({ x: 1, y: 1 });
    FilledTiles = [{ position: snakehead.gridposition, objectType: OBJECT_TYPE.snakehead }, { position: food.gridposition, objectType: OBJECT_TYPE.food }];
    gameStart();
}

function showScore() {
    
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBasedAlign = "middle";
    ctx.font = (SQUARES_DIVISION_AMOUNT * 0.5) + "px dejavu sans mono";
    ctx.clearRect(0, 0, canvas.width, SQUARES_DIVISION_AMOUNT);
    ctx.fillText("High score - " + highScore, canvas.width / 2, SQUARES_DIVISION_AMOUNT);
    
    ctx.fillText(score, canvas.width - SQUARES_DIVISION_AMOUNT, SQUARES_DIVISION_AMOUNT);
}

function gameDraw() {
    checkScore();
    showScore();
    moveFood();
    snakehead.draw();
    
}

//-----------------------Listen for key press----------------
document.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 37: //left key
            //console.log("left key down");
            snakehead.updateMoveDirection(MOVE_DIRECTION.left);
            //console.log(snakehead.gridposition.x);
            break;
        case 39: //right key
            snakehead.updateMoveDirection(MOVE_DIRECTION.right);
            break;
        case 38: //up key
            snakehead.updateMoveDirection(MOVE_DIRECTION.up);
            break;
        case 40: //down
            snakehead.updateMoveDirection(MOVE_DIRECTION.down);
            break;
           

    }


});

document.addEventListener("keyup", event => {
    switch (event.keyCode) {
        case 37: //left key
            
            break;
        case 39: //right key
            break;
        case 38: //up key
            break;
        case 40: //down
            break;


    }


});

//------------------- World game Start----------------

gameStart();

