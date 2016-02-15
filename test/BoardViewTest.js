var requirejs = require("requirejs");
var assert = require("chai").assert;

requirejs.config({
    baseUrl: "./js/app",
    nodeRequire: require
});

var BoardView = requirejs("view/board-view");
var Coordinate = requirejs("model/coordinate");

describe("BoardView", function() {
    "use strict";
  
    it("should be able to generate a random food location that is within bounds and not overlapping with snake", function(done) {
        let canvas = { width: 500, height: 400, getContext: function(){} };
        let boardView = new BoardView(canvas, 12.5);
        let snakeCoordinates = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        
        for (let i = 0; i < 10000; i++) {
            let coordinate = boardView.getRandomCoordinate(snakeCoordinates);
            // verify coordinate is in bounds
            assert.isTrue(coordinate.x >= 1);
            assert.isTrue(coordinate.x < canvas.width/boardView.squareSizeInPixels);
            assert.isTrue(coordinate.y >= 1);
            assert.isTrue(coordinate.y < canvas.height/boardView.squareSizeInPixels);
            // verify coordinate is not overlapping with snake
            for(let snakeCoord of snakeCoordinates) {
                assert.isFalse(coordinate.equals(snakeCoord));
            }
        }
        done();
    });
});