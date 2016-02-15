define([
    "model/direction",
    "model/food",
    "model/score-board",
    "model/snake",
    "view/board-view-factory"
],

function (Direction, Food, ScoreBoard, Snake, BoardViewFactory) {
    "use strict";

    const GAME_TITLE = "SNAKE!";
    const NEW_GAME_MESSAGE = "Press SPACE to begin";
    const MAX_FPS = 60;
    const STARTING_FPS = 8;
    const SQUARE_SIZE_IN_PIXELS = 12.5;
    const HORIZONTAL_SQUARES = 50;
    const VERTICAL_SQUARES = 40;
    const SPACE_BAR_KEYCODE = 32;
    const KEYCODE_TO_DIRECTION = {
        87 : Direction.UP,    //W
        65 : Direction.LEFT,  //A
        83 : Direction.DOWN,  //S
        68 : Direction.RIGHT, //D
        38 : Direction.UP,    //up arrow
        37 : Direction.LEFT,  //left arrow
        40 : Direction.DOWN,  //down arrow
        39 : Direction.RIGHT  //right arrow
    };
    
    class SnakeGame {

        constructor() {
            this.scoreBoard = new ScoreBoard();
            this.boardView = BoardViewFactory.createBoardView(SQUARE_SIZE_IN_PIXELS, HORIZONTAL_SQUARES, VERTICAL_SQUARES);
            this.boardView.clear();
            this._initializeKeyDownHandlers();
            this._initializeGameValues();
        }
       
        // Runs a single game cycle
        runGameCycle() {
            // Start by drawing the current state
            this.boardView.clear();
            this.boardView.drawSquare(this.food.location, this.food.color); 
            this.boardView.drawSquares(this.snake.segments, this.snake.color);
            // Record the last drawn snake direction, to limit the player from moving too quickly back into themselves
            this.lastKnownSnakeDirection = this.snake.direction;
            
            // Move the snake one unit
            this.snake.move();
            
            // Check the snake for lose conditions
            if(this._isGameOver()) {
                // Draw the losing head position in red
                this.boardView.drawSquare(this.snake.segments[1], "red");
                this._initializeGameValues();
                // Break out of the game cycle
                return;
            }
            
            // If the snake has collected food this turn, increase the game speed and grow the snake next turn 
            if(this.snake.getHeadLocation().equals(this.food.location)) {
                this.snake.growNextTurn();
                this.food.setLocation(this.boardView.getRandomCoordinate(this.snake.segments));
                // Increase game speed through FPS
                this.currentFPS = this.currentFPS >= MAX_FPS? MAX_FPS : this.currentFPS+1;
                this.scoreBoard.increaseScore();
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
            this.currentFPS = STARTING_FPS;
            this.scoreBoard.resetScore();
            this.boardView.showSplashScreen(GAME_TITLE, NEW_GAME_MESSAGE);
            this.snake = new Snake("white");
            this.lastKnownSnakeDirection = this.snake.direction;
            this.food = new Food(this.boardView.getRandomCoordinate(this.snake.segments), "lightgreen");
        }
        
        /*******************
         *  Input handling *
         *******************/
        
        _initializeKeyDownHandlers() {
            window.addEventListener( "keydown", this._handleKeyDown.bind(this), true);
        }
        
        _handleKeyDown(e) {
            if(this.boardView.isSplashScreenDisplayed) {
                if(e.keyCode === SPACE_BAR_KEYCODE) {
                    this.runGameCycle();
                }
            } else {
                let newDirection = KEYCODE_TO_DIRECTION[e.keyCode];
                if(newDirection && this._isValidDirection(newDirection)) {
                    this.snake.changeDirection(newDirection); 
                }
            }
        }
        
        /*******************
         *  Boolean checks *
         *******************/
         
        _isGameOver() {
            return this.snake.hasCollidedWithSelf() || this.boardView.isOutOfBounds(this.snake.getHeadLocation());
        }
        
        // Check if a new direction is not going backwards
        _isValidDirection(newDirection) {
            return !((newDirection == this.snake.direction) ||
                (newDirection == Direction.UP && this.lastKnownSnakeDirection == Direction.DOWN) ||
                (newDirection == Direction.DOWN && this.lastKnownSnakeDirection == Direction.UP) ||
                (newDirection == Direction.LEFT && this.lastKnownSnakeDirection == Direction.RIGHT) ||
                (newDirection == Direction.RIGHT && this.lastKnownSnakeDirection == Direction.LEFT));
        }
    }
    
    return SnakeGame;
});