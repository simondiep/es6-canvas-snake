var requirejs = require("requirejs");
var assert = require("chai").assert;

requirejs.config({
    baseUrl: "./js/app",
    nodeRequire: require
});

var GameController = requirejs("controller/game-controller");
var Direction = requirejs("model/direction");
var Player = requirejs("model/player");

describe("GameController", function() {
    "use strict";
  
    it("should not allow a player to move backwards", function(done) {
        let player = new Player();
        player.direction = Direction.RIGHT;
        player.directionBeforeMove = Direction.RIGHT;
        assert.isTrue(GameController.prototype._isInvalidDirection(player, Direction.RIGHT));
        assert.isTrue(GameController.prototype._isInvalidDirection(player, Direction.LEFT));
        assert.isFalse(GameController.prototype._isInvalidDirection(player, Direction.UP));
        
        player.direction = Direction.UP;
        player.directionBeforeMove = Direction.RIGHT;
        assert.isTrue(GameController.prototype._isInvalidDirection(player, Direction.UP));
        assert.isTrue(GameController.prototype._isInvalidDirection(player, Direction.LEFT));
        assert.isFalse(GameController.prototype._isInvalidDirection(player, Direction.RIGHT));
        
        done();
    });
});