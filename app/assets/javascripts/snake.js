
var Snake = Snake || new (function (){
    //Canvas stuff
    var that = this;
    var canvas;
    var context;
    var canvasWidth;
    var canvasHeight;

    //Lets save the cell width in a variable for easy control
    var snakeNodeWidth = 11;
    var direction;
    var foodPiece;
    var score;

    //Lets create the snake now
    var snake_array; //an array of cells to make up the snake



    this.init = function(options)
    {
        options = $.extend({}, options);

        canvas = $("#canvas")[0]
        if(canvas === undefined){
            return;
        }
        context = canvas.getContext("2d");
        canvasWidth = options["canvasWidth"] || canvasWidth || $("#canvas").width();
        canvasHeight = options["canvasHeight"] || canvasHeight || $("#canvas").height();

        direction = "right"; //default direction
        create_snake(options["snakeLength"] || 15);
        create_food(); //Now we can see the food particle
        //finally lets display the score
        score = 0;

        //Lets move the snake now using a timer which will trigger the paint function
        //every 80ms
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(move_snake, 80);
    };

    var max_column = function(){
        return (canvasWidth/snakeNodeWidth)-1;
    };

    var max_row = function(){
        return (canvasHeight/snakeNodeWidth)-1;
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
            x: Math.round(Math.random()*(max_column())),
            y: Math.round(Math.random()*(max_row()))
        };
    };

    var newPosition = function(){
        var head = jQuery.extend({},snake_array[0] );

        if(direction == "right") head.x++;
        else if(direction == "left") head.x--;
        else if(direction == "up") head.y--;
        else if(direction == "down") head.y++;

        return head;
    };

    var outOfBounds = function(coord){
        return coord.x <0 || coord.x > max_column() || coord.y < 0 || coord.y > max_row()

    };

    var isOn=function(coordA, coordB){
        return coordA.x == coordB.x && coordA.y == coordB.y
    }

    var move_snake= function()
    {
        paint();
        var nextMove = newPosition();

        if(outOfBounds(nextMove) || check_collision(nextMove, snake_array)){
            Snake.init();  //game over
            return;
        }

        if(isOn(nextMove, foodPiece)){
            score++;
            create_food();
        }
        else{
            snake_array.pop();
        }

        snake_array.unshift(nextMove);



    };

    var paint = function(){
        //Paint the background on every frame to avoid ghosting
        context.fillStyle = "white";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        context.strokeStyle = "black";
        context.strokeRect(0, 0, canvasWidth, canvasHeight)


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
        context.fillStyle = "green";
        context.fillRect(x*snakeNodeWidth, y*snakeNodeWidth, snakeNodeWidth, snakeNodeWidth);
        context.strokeStyle = "white";
        context.strokeRect(x*snakeNodeWidth, y*snakeNodeWidth, snakeNodeWidth, snakeNodeWidth);
    };

    var check_collision= function(coord, array)
    {
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == coord.x && array[i].y == coord.y)
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
        init:function(options){
            that.init(options);
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

        //Read-only methods:

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
        },

        foodLocation:function(){
            return foodPiece;
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
