describe('Snake js behavior', function(){

    beforeEach(function(){
        loadFixtures('rspec_snake_page.html');
    });

    describe('initialization', function(){

        it('should initialize a snake object with the canvas dimensions', function(){
            $("#canvas")[0].width=300
            $("#canvas")[0].height=300
            //intervalSpy = spyOn("setInterval")

            Snake.init();
            expect(Snake.canvasWidth).toBe(300);
            expect(Snake.canvasHeight).toBe(300);

            expect(Snake.direction).toBe("right");
            expect(Snake.score).toBe(0);

            //expect(intervalSpy).toHaveBeenCalled();




        })


    });




});