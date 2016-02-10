define(function () {
    "use strict";

    class ScoreBoard {
    
        constructor() {
            this.score = 0;
            this.highScore = localStorage.getItem("snake-high-score") || 0;
            this.scoreElement = document.getElementById("score");
            this.scoreElement.innerHTML = this.score;
            
            this.highScoreElement = document.getElementById("highScore");
            this.highScoreElement.innerHTML = this.highScore;
        }
        
        increaseScore() {
            this.scoreElement.innerHTML = ++this.score;
                
            if(this.score > this.highScore) {
                this.highScore = this.score;
                this.highScoreElement.innerHTML = this.highScore;
                // Store the high score in local storage for later retrieval
                localStorage.setItem("snake-high-score", this.highScore);
            }
        }
        
        resetScore() {
            this.score = 0;
            this.scoreElement.innerHTML = this.score;
        }
    }

    return ScoreBoard;

});     