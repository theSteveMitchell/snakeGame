$(document).ready(function(){
    Snake.init();

    //keyboard controls
    $(document).keydown(function(e){
        var key = e.which;
        Snake.changeDirection(key)
    });
});
var Snake = new (function (){
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
        Snake.canvas = $("#canvas")[0];
        Snake.context = Snake.canvas.getContext("2d");
        Snake.canvasWidth = $("#canvas").width();
        Snake.canvasHeight = $("#canvas").height();

        Snake.direction = "right"; //default direction
        create_snake(15);
        Snake.create_food(); //Now we can see the food particle
        //finally lets display the score
        score = 0;

        //Lets move the snake now using a timer which will trigger the paint function
        //every 60ms
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(Snake.paint, 80);
    };



    create_snake = function(length)
    {
        length = length || 5; //Length of the snake
        Snake.snake_array = []; //Empty array to start with
        for(var i = length-1; i>=0; i--)
        {
            //This will create a horizontal snake starting from the top left
            Snake.snake_array.push({x: i, y:0});
        }
    };

    //Lets create the food now
    this.create_food= function()
    {
        foodPiece = {
            x: Math.round(Math.random()*(Snake.w-Snake.snakeNodeWidth)/Snake.snakeNodeWidth),
            y: Math.round(Math.random()*(Snake.canvasHeight-Snake.snakeNodeWidth)/Snake.snakeNodeWidth)
        };
        //This will create a cell with x/y between 0-44
        //Because there are 45(450/10) positions accross the rows and columns
    };

    //Lets paint the snake now
    this.paint= function()
    {
        //To avoid the snake trail we need to paint the BG on every frame
        //Lets paint the canvas now
        Snake.context.fillStyle = "white";
        Snake.context.fillRect(0, 0, Snake.canvasWidth, Snake.canvasHeight);
        Snake.context.strokeStyle = "black";
        Snake.context.strokeRect(0, 0, Snake.canvasWidth, Snake.canvasHeight);

        //The movement code for the snake to come here.
        //The logic is simple
        //Pop out the tail cell and place it infront of the head cell
        var nx = Snake.snake_array[0].x;
        var ny = Snake.snake_array[0].y;
        //These were the position of the head cell.
        //We will increment it to get the new head position
        //Lets add proper direction based movement now
        if(Snake.direction == "right") nx++;
        else if(Snake.direction == "left") nx--;
        else if(Snake.direction == "up") ny--;
        else if(Snake.direction == "down") ny++;

        //Lets add the game over clauses now
        //This will restart the game if the snake hits the wall
        //Lets add the code for body collision
        //Now if the head of the snake bumps into its body, the game will restart
        if(nx <= -1 || nx >= Snake.canvasWidth/Snake.snakeNodeWidth || ny <= -1 || ny >= Snake.canvasHeight/Snake.snakeNodeWidth || Snake.check_collision(nx, ny, Snake.snake_array))
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
            game_loop = setInterval(Snake.paint, 40);

            //Create new food
            Snake.create_food();
        }
        else
        {
            var tail = Snake.snake_array.pop(); //pops out the last cell
            tail.x = nx; tail.y = ny;
        }
        //The snake can now eat the food.

        Snake.snake_array.unshift(tail); //puts back the tail as the first cell

        for(var i = 0; i < Snake.snake_array.length; i++)
        {
            var c = Snake.snake_array[i];
            //Lets paint 10px wide cells
            Snake.paint_cell(c.x, c.y);
        }

        //Lets paint the food
        Snake.paint_cell(foodPiece.x, foodPiece.y);
        //Lets paint the score
        var score_text = "Score: " + score;
        Snake.context.fillText(score_text, 5, Snake.canvasHeight-5);
    };

    //Lets first create a generic function to paint cells
    this.paint_cell= function(x, y)
    {
        Snake.context.fillStyle = "blue";
        Snake.context.fillRect(x*Snake.snakeNodeWidth, y*Snake.snakeNodeWidth, Snake.snakeNodeWidth, Snake.snakeNodeWidth);
        Snake.context.strokeStyle = "white";
        Snake.context.strokeRect(x*Snake.snakeNodeWidth, y*Snake.snakeNodeWidth, Snake.snakeNodeWidth, Snake.snakeNodeWidth);
    };

    this.check_collision= function(x, y, array)
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

    this.changeDirection = function(key){
    //We will add another clause to prevent reverse gear
    if(key == "37" && Snake.direction != "right") Snake.direction = "left";
    else if(key == "38" && Snake.direction != "down") Snake.direction = "up";
    else if(key == "39" && Snake.direction != "left") Snake.direction = "right";
    else if(key == "40" && Snake.direction != "up") Snake.direction = "down";
    //The snake is now keyboard controllable

    };

    return{

        init:function(){
            that.init();
        },

        changeDirection:function(key){
            that.changeDirection(key);
        },

        pause:function(){
            that.stopPainting();
        },

        score:function () {
            that.score;
        }
    }




});
