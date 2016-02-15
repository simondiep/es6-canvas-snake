define(function () {
    "use strict";

    class ScoreBoard {
    
        constructor() {
            this.score = 0;
            if(typeof localStorage !== "undefined") {
                this.highScore = localStorage.getItem("snake-high-score") || 0;
                this.highScoreName = localStorage.getItem("snake-high-score-name") || "";
            }
            this.scoreElement = document.getElementById("score");
            this.scoreElement.innerHTML = this.score;
            
            this.highScoreElement = document.getElementById("highScore");
            this.highScoreElement.innerHTML = this._createScoreString(this.highScoreName, this.highScore);
        }
        
        increaseScore(name) {
            this.scoreElement.innerHTML = ++this.score;
                
            if(this.score > this.highScore) {
                this.highScore = this.score;
                this.highScoreElement.innerHTML = this._createScoreString(name, this.highScore);
                // Store the high score in local storage for later retrieval
                if(typeof localStorage !== "undefined") {
                    localStorage.setItem("snake-high-score", this.highScore);
                    localStorage.setItem("snake-high-score-name", name);
                }
            }
        }
        
        resetScore() {
            this.score = 0;
            this.scoreElement.innerHTML = this.score;
        }
        
        _createScoreString(name, score) {
            return name + " " + score;
        }
    }

    return ScoreBoard;

});     