var Snakebot = Snakebot || new (function (){
  var that = this;

    this.playDaMoFo = function()
    {
          if(Snake.paused() == true){
            return;
          }

         //This is a bit convoluted...Let's call this one an acceptance test.
            food = Snake.foodLocation();
            head = Snake.getHead();

            //starting at 0, so in the .1% chance that food spawns on 0,0, this test will fail.
            deltaX = food["x"]- head["x"];
            deltaY = food["y"] - head["y"];

            console.log("deltaX: " + deltaX);
            console.log("deltaY: " + deltaY);
            console.log("foodx: " + food["x"]);
            console.log("foody: " + food["y"]);
            console.log("headx: " + head["x"]);
            console.log("heady: " + head["y"]);

            if (deltaY > 0){
              this.go("down");
            }
             else if (deltaY < 0){
              this.go("up");
            }
             else if (deltaX > 0){
              this.go("right");
            }
             else if (deltaX < 0){
              this.go("left");
            }


            //tick the clock to let the snake crawl to the same column as the food

            //tick the clock to let the snake crawl down to the food.


            //Snake should have grabbed the food.
            //console.log("snake is at x" + Snake.getHead()["x"] + ", y" + Snake.getHead()["y"] );

          };

      this.go = function(direction){
        console.log ("changing direction to " + direction + "and snake is at " + Snake.getHead()["x"]);

        Snake.changeDirection(direction);
        return true;

      };

    return{
        //Here is the public API for the snake object.
        playDaMoFo:function(){
            that.playDaMoFo();
        }
    }
});







$(document).on('ready', function(){

if(typeof player_loop != "undefined") clearInterval(player_loop);
    player_loop = setInterval(Snakebot.playDaMoFo, 10);

});
