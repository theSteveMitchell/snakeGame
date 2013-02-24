
var Snake = Snake || new (function (){
    //Canvas stuff
    var that = this;
    var canvas;
    var context;
    var canvasWidth;
    var canvasHeight;

    //Lets save the cell width in a variable for easy control
    var snakeNodeWidth = 10;
    var direction;
    var foodPiece;
    var score;

    //Lets create the snake now
    this.snakeArray; //an array of cells to make up the snake



    this.init = function()
    {
        canvas = $("#canvas")[0]
        if(canvas === undefined){
            return;
        }
        context = canvas.getContext("2d");
        canvasWidth = $("#canvas").width();
        canvasHeight = $("#canvas").height();

        direction = "right"; //default direction
        create_snake(15);
        create_food(); //Now we can see the food particle
        //finally lets display the score
        score = 0;

        //Lets move the snake now using a timer which will trigger the paint function
        //every 60ms
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 80);
    };



    var create_snake = function(length)
    {
        length = length || 5; //Length of the snake
        snake_array = []; //Empty array to start with
        for(var i = length-1; i>=0; i--)
        {
            //This will create a horizontal snake starting from the top left
            snake_array.push({x: i, y:0});
        }
    };

    //Lets create the food now
    var create_food= function()
    {
        foodPiece = {
            x: Math.round(Math.random()*(canvasWidth-snakeNodeWidth)/snakeNodeWidth),
            y: Math.round(Math.random()*(canvasHeight-snakeNodeWidth)/snakeNodeWidth)
        };
        //This will create a cell with x/y between 0-44
        //Because there are 45(450/10) positions accross the rows and columns
    };

    //Lets paint the snake now
    var paint= function()
    {
        //To avoid the snake trail we need to paint the BG on every frame
        //Lets paint the canvas now
        context.fillStyle = "white";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        context.strokeStyle = "black";
        context.strokeRect(0, 0, canvasWidth, canvasHeight);

        //The movement code for the snake to come here.
        //The logic is simple
        //Pop out the tail cell and place it infront of the head cell
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;
        //These were the position of the head cell.
        //We will increment it to get the new head position
        //Lets add proper direction based movement now
        if(direction == "right") nx++;
        else if(direction == "left") nx--;
        else if(direction == "up") ny--;
        else if(direction == "down") ny++;

        //Lets add the game over clauses now
        //This will restart the game if the snake hits the wall
        //Lets add the code for body collision
        //Now if the head of the snake bumps into its body, the game will restart
        if(nx <= -1 || nx >= canvasWidth/snakeNodeWidth || ny <= -1 || ny >= canvasHeight/snakeNodeWidth || check_collision(nx, ny, snake_array))
        {
            //restart game
            Snake.init();
            //Lets organize the code a bit now.
            return;
        }

        //Lets write the code to make the snake eat the food
        //The logic is simple
        //If the new head position matches with that of the food,
        //Create a new head instead of moving the tail
        if(nx == foodPiece.x && ny == foodPiece.y)
        {
            var tail = {x: nx, y: ny};
            score++;
            clearInterval(game_loop)
            game_loop = setInterval(paint, 40);

            //Create new food
            create_food();
        }
        else
        {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx; tail.y = ny;
        }
        //The snake can now eat the food.

        snake_array.unshift(tail); //puts back the tail as the first cell

        for(var i = 0; i < snake_array.length; i++)
        {
            var c = snake_array[i];
            //Lets paint 10px wide cells
            paint_cell(c.x, c.y);
        }

        //Lets paint the food
        paint_cell(foodPiece.x, foodPiece.y);
        //Lets paint the score
        var score_text = "Score: " + score;
        context.fillText(score_text, 5, canvasHeight-5);
    };

    //Lets first create a generic function to paint cells
    var paint_cell= function(x, y)
    {
        context.fillStyle = "blue";
        context.fillRect(x*snakeNodeWidth, y*snakeNodeWidth, snakeNodeWidth, snakeNodeWidth);
        context.strokeStyle = "white";
        context.strokeRect(x*snakeNodeWidth, y*snakeNodeWidth, snakeNodeWidth, snakeNodeWidth);
    };

    var check_collision= function(x, y, array)
    {
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    };

    this.stopPainting = function()
    {
        clearInterval(game_loop)
    };

    this.changeDirection = function(newDirection){
    //We will add another clause to prevent reverse gear
    if(newDirection == "left" && direction != "right") direction = "left";
    else if(newDirection == "up" && direction != "down") direction = "up";
    else if(newDirection == "right" && direction != "left") direction = "right";
    else if(newDirection == "down" && direction != "up") direction = "down";
    //The snake is now keyboard controllable

    };

    return{
        //Here is the public API for the snake object.
        init:function(){
            that.init();
        },

        changeDirection:function(key){
            that.changeDirection(key);
        },

        getHead:function(){
            return snake_array[0];
        },

        getTail:function(){
            return snake_array[snake_array.length-1];
        },

        getBody:function(){
            return snake_array;
        },

        pause:function(){
            that.stopPainting();
        },


        //Read-only methods.
        score:function () {
            return score;
        },

        canvasWidth:function () {
            return canvasWidth;
        },

        canvasHeight:function () {
            return canvasHeight;
        },

        direction:function () {
            return direction;
        }

    }




});

$(document).on('ready', function(){
    Snake.init();

    //keyboard controls
    $(document).keydown(function(e){
        var key = e.which;
        if(key == "37") newDirection = "left";
        else if(key == "38") newDirection = "up";
        else if(key == "39") newDirection = "right";
        else if(key == "40") newDirection = "down";

        Snake.changeDirection(newDirection)
    });
});
