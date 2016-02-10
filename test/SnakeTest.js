var requirejs = require("requirejs");
var assert = require("chai").assert;

requirejs.config({
    baseUrl: "./js/app",
    nodeRequire: require
});

var Coordinate = requirejs("model/coordinate");
var Direction = requirejs("model/direction");
var Snake = requirejs("model/snake");

describe("Snake", function() {
    "use strict";
  
    // ---+-  Collision at + sign
    //    --
    it("should determine if it collided with itself", function(done) {
        let snake = new Snake();
        assert.isFalse(snake.hasCollidedWithSelf(), "Snake should not have detected collision");
        snake.segments = [new Coordinate(4,1),new Coordinate(4,2),new Coordinate(5,2),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        assert.isTrue(snake.hasCollidedWithSelf(), "A collision should have been detected");
        done();
    });
    
    it("should move to the next location based on current direction", function(done) {
        let snake = new Snake();
        snake.segments = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        
        snake.changeDirection(Direction.RIGHT);
        snake.move();
        let expectedSegments = [new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1)];
        assert.deepEqual(snake.segments, expectedSegments, "Snake did not move right as expected");
        
        snake.changeDirection(Direction.DOWN);
        snake.move();
        expectedSegments = [new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1)];
        assert.deepEqual(snake.segments, expectedSegments, "Snake did not move down as expected");
        
        snake.changeDirection(Direction.LEFT);
        snake.move();
        expectedSegments = [new Coordinate(5,2),new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1)];
        assert.deepEqual(snake.segments, expectedSegments, "Snake did not move left as expected");
        
        snake.changeDirection(Direction.UP);
        snake.move();
        expectedSegments = [new Coordinate(5,1),new Coordinate(5,2),new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1)];
        assert.deepEqual(snake.segments, expectedSegments, "Snake did not move up as expected");
        done();
    });
    
    it("should be able to grow on request", function(done) {
        let snake = new Snake();
        snake.segments = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        snake.growNextTurn();
        snake.changeDirection(Direction.RIGHT);
        snake.move();
        let expectedSegments = [new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        assert.deepEqual(snake.segments, expectedSegments, "Snake did not move right and grow as expected");
        
        snake.changeDirection(Direction.DOWN);
        snake.move();
        expectedSegments = [new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1)];
        assert.deepEqual(snake.segments, expectedSegments, "Snake did not move down or unexpectedly grew");
        done();
    });
});