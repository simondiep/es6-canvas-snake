define([
    "game-config",
    "model/direction",
    "model/food",
    "model/player",
    "model/score-board",
    "view/board-view-factory",
    "view/game-view"
],

function (GameConfig, Direction, Food, Player, ScoreBoard, BoardViewFactory, GameView) {
    "use strict";
    
    class GameController {

        constructor() {
            this.scoreBoard = new ScoreBoard();
            this.boardView = BoardViewFactory.createBoardView(GameConfig.SQUARE_SIZE_IN_PIXELS, GameConfig.HORIZONTAL_SQUARES, GameConfig.VERTICAL_SQUARES);
            this.boardView.clear();
            this.gameView = new GameView(this.startNewGame.bind(this), this.changeDirection.bind(this), this.isSplashScreenDisplayed.bind(this), this.updatePlayerName.bind(this));
            this._initializeGameValues();
            this.gameView.showChangeNameButton();
            this.boardView.showSplashScreen(GameConfig.GAME_TITLE, GameConfig.NEW_GAME_MESSAGE);
        }
       
        // Runs a single game cycle
        runGameCycle() {
            // Start by drawing the current state
            this.boardView.clear();
            this.boardView.drawSquare(this.food.location, this.food.color); 
            this.boardView.drawSquares(this.player.segments, this.player.color);
            
            // Move the player one unit
            this.player.move();
            
            // Check the player for lose conditions
            if(this._isGameOver()) {
                // Draw the losing head position in red
                this.boardView.drawSquare(this.player.segments[1], "red");
                this.boardView.showSplashScreen(GameConfig.GAME_TITLE, GameConfig.NEW_GAME_MESSAGE);
                // Break out of the game cycle
                this.gameView.showChangeNameButton();
                return;
            }
            
            // If the player has collected food this turn, increase the game speed and grow the player next turn 
            if(this.player.getHeadLocation().equals(this.food.location)) {
                this.player.growNextTurn();
                this.food.setLocation(this.boardView.getRandomCoordinate(this.player.segments));
                // Increase game speed through FPS
                this.currentFPS = this.currentFPS >= GameConfig.MAX_FPS? GameConfig.MAX_FPS : this.currentFPS+1;
                this.scoreBoard.increaseScore(this.player.name);
            }
            
            let self = this;
            // Run in a loop
            setTimeout(function() {
                requestAnimationFrame(self.runGameCycle.bind(self));
            }, 1000 / this.currentFPS);
        }
        
        /**
         * Set up values for a new game
         */
        _initializeGameValues() {
            this.currentFPS = GameConfig.STARTING_FPS;
            this.scoreBoard.resetScore();

            this.player = new Player(this.gameView.getPlayerName(), "white");
            this.food = new Food(this.boardView.getRandomCoordinate(this.player.segments), "lightgreen");
            this.gameView.hideChangeNameButton();
        }
        
        /*******************
         *  View Callbacks *
         *******************/
        
        startNewGame() {
            this._initializeGameValues();
            this.runGameCycle();
        }
        
        changeDirection(newDirection) {
            if(!this._isInvalidDirection(this.player, newDirection)) {
                this.player.changeDirection(newDirection); 
            }
        }
        
        isSplashScreenDisplayed() {
            return this.boardView.isSplashScreenDisplayed;
        }
        
        updatePlayerName(name) {
            this.player.name = name;
        }
        
        /*******************
         *  Boolean checks *
         *******************/
         
        _isGameOver() {
            return this.player.hasCollidedWithSelf() || this.boardView.isOutOfBounds(this.player.getHeadLocation());
        }
        
        // Check if a new direction is going backwards
        _isInvalidDirection(player, newDirection) {
            return (!newDirection) ||
                (newDirection == player.direction) ||
                (newDirection == Direction.UP && player.directionBeforeMove == Direction.DOWN) ||
                (newDirection == Direction.DOWN && player.directionBeforeMove == Direction.UP) ||
                (newDirection == Direction.LEFT && player.directionBeforeMove == Direction.RIGHT) ||
                (newDirection == Direction.RIGHT && player.directionBeforeMove == Direction.LEFT);
        }
    }
    
    return GameController;
});