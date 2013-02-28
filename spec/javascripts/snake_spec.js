describe('Snake js behavior', function(){

    beforeEach(function(){
        loadFixtures('rspec_snake_page.html');
    });

    describe('initialization', function(){

        it('should initialize a snake object with the canvas dimensions', function(){
            $("#canvas")[0].width=300
            $("#canvas")[0].height=300
            intervalSpy = spyOn(window, "setInterval")

            Snake.init();
            expect(Snake.canvasWidth()).toBe(300);
            expect(Snake.canvasHeight()).toBe(300);

            expect(Snake.direction()).toBe("right");
            expect(Snake.score()).toBe(0);

            expect(intervalSpy).toHaveBeenCalledWith(jasmine.any(Function), 80);
        });

        it('should take some initialization parameters for canvas dimensions', function(){
            Snake.init({"canvasWidth":200, "canvasHeight":20});
            expect(Snake.canvasWidth()).toBe(200);
            expect(Snake.canvasHeight()).toBe(20);
        });

        it('should take some initialization parameters for snake length', function(){
            Snake.init({"snakeLength":1});
            expect(Snake.getBody().length).toEqual(1);
        });



//        it('should take some initialization parameters for snake length/speed', function(){
//            Snake.init({"speed":80, "snakeLength":2});
//            expect(Snake.canvasWidth()).toBe(200);
//            expect(Snake.canvasHeight()).toBe(20);
//        });
    });

    describe('changeDirection', function(){

        beforeEach(function(){
            Snake.init({"canvasHeight":300, "canvasWidth":300, "snakeLength":15});
        });

        it('should update the direction of the snake', function(){
            expect(Snake.direction()).toBe("right");
            Snake.changeDirection("down");
            expect(Snake.direction()).toBe("down");
            Snake.changeDirection("left");
            expect(Snake.direction()).toBe("left");
            Snake.changeDirection("down");
            expect(Snake.direction()).toBe("down");
            Snake.changeDirection("right");
            expect(Snake.direction()).toBe("right");
            Snake.changeDirection("up");
            expect(Snake.direction()).toBe("up");
        });

        it('should prevent reversing direction of the snake', function(){
            expect(Snake.direction()).toBe("right");
            Snake.changeDirection("left");
            expect(Snake.direction()).toBe("right");
            Snake.changeDirection("down");
            expect(Snake.direction()).toBe("down");
            Snake.changeDirection("up");
            expect(Snake.direction()).toBe("down");
            Snake.changeDirection("left");
            expect(Snake.direction()).toBe("left");
            Snake.changeDirection("right");
            expect(Snake.direction()).toBe("left");
            Snake.changeDirection("up");
            expect(Snake.direction()).toBe("up");
            Snake.changeDirection("down");
            expect(Snake.direction()).toBe("up");
        });

    });

    describe('getHead', function(){
        //because you better know how to do it right!
        beforeEach(function(){
            Snake.init();
        });

        it('should give the location of the head node', function(){
            //TODO assumes a staring length of 15, which is bad....
            expect(Snake.getHead()).toEqual({ x : 14, y : 0 } )
        })


    });

    describe('getTail', function(){
        //arguably even more important than getTail
        beforeEach(function(){
            Snake.init();
        });

        it('should give the location of the tail node', function(){
            expect(Snake.getTail()).toEqual({ x : 0, y : 0 } );
        });
    });

    describe('getBody', function(){
        //Any good application has built-in potential for puns.
        beforeEach(function(){
            Snake.init();
        });

        it('should give the locations of all the snake nodes', function(){
            body = Snake.getBody();
            //TODO assumes a staring length of 15, which is bad....
            expect(body.length).toBe(15);
            $.each( body, function( index, segment ) {
                expect(segment["x"]).toEqual(15-(index+1));
                expect(segment["y"]).toEqual(0);
            });
        });
    });

    describe('paint', function(){
        beforeEach(function(){
            jasmine.Clock.useMock();
            Snake.init();
        });

        it('should update the position of the snake each paint cycle', function(){
            //Paint is a private method so we can't spy on it or call it directly.
            expect(Snake.getHead()).toEqual({ x : 14, y : 0 } );
            expect(Snake.getTail()).toEqual({ x : 0, y : 0 } );

            jasmine.Clock.tick(80);
            expect(Snake.getHead()).toEqual({ x : 15, y : 0 } );
            expect(Snake.getTail()).toEqual({ x : 1, y : 0 } );

            Snake.changeDirection("down");
            jasmine.Clock.tick(80);
            expect(Snake.getHead()).toEqual({ x : 15, y : 1 } );
            expect(Snake.getTail()).toEqual({ x : 2, y : 0 } );

            Snake.changeDirection("left");
            jasmine.Clock.tick(80);
            expect(Snake.getHead()).toEqual({ x : 14, y : 1 } );
            expect(Snake.getTail()).toEqual({ x : 3, y : 0 } );
        });

        it("should reset the game if the snake hits a wall", function(){
            expect(Snake.getHead()).toEqual({ x : 14, y : 0 } );
            Snake.changeDirection("up");
            initSpy = spyOn(Snake, "init");

            jasmine.Clock.tick(80);
            expect(initSpy).wasCalled();
            expect(Snake.getHead()).toEqual({ x : 14, y : 0 } );
        });
    });

    describe('food getting', function(){
        beforeEach(function(){
            jasmine.Clock.useMock();
            Snake.init({"canvasHeight":100, "canvasWidth":100, "snakeLength":1});

        });

        it('should place food within the canvas randomishly', function(){
            expect(Snake.foodLocation()["x"]).toBeLessThan(10);
            expect(Snake.foodLocation()["y"]).toBeLessThan(10);

            expect(Snake.foodLocation()["x"]).toBeGreaterThan(-1);
            expect(Snake.foodLocation()["y"]).toBeGreaterThan(-1);

        });

        it("should award points if the snake gets the food", function(){
            //This is a bit convoluted...Let's call this one an acceptance test.
            food = Snake.foodLocation();

            //starting at 0, so in the .1% chance that food spawns on 0,0, this test will fail.
            deltaX = food["x"];
            deltaY = food["y"];

            //tick the clock to let the snake crawl to the same column as the food.
            jasmine.Clock.tick(80*deltaX);
            console.log("Snake is at x" + Snake.getHead()["x"] );

            //tick the clock to let the snake crawl down to the food.
            Snake.changeDirection("down");
            jasmine.Clock.tick(80*deltaY);

            //Snake should have grabbed the food.
            //console.log("snake is at x" + Snake.getHead()["x"] + ", y" + Snake.getHead()["y"] );
            expect(Snake.score()).toBe(1);
            //new food should be placed, in a different spot on the board.
            food = Snake.foodLocation();
            expect(food).not.toEqual({"x": deltaX, "y":deltaY})
            expect(food["x"]).toBeLessThan(10);
            expect(food["y"]).toBeLessThan(10);

            expect(food["x"]).toBeGreaterThan(-1);
            expect(food["y"]).toBeGreaterThan(-1);

        });


    });









});