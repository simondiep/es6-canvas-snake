define([
    "model/coordinate"
],

function (Coordinate) {
    "use strict";
    
    class BoardView {
        
        constructor(canvas, squareSizeInPixels) {
            this.height = canvas.height;
            this.width = canvas.width;
            this.context = canvas.getContext("2d");
            this.squareSizeInPixels = squareSizeInPixels;
            this.isSplashScreenDisplayed = false;
        }
        
        clear() {
            this.context.fillStyle = "black";
            this.context.globalAlpha = 1;
            this.context.fillRect(0, 0, this.width, this.height);
            this.isSplashScreenDisplayed = false;
        }
        
        drawSquares(coordinates, color) {
            for(let coordinate of coordinates) {
                this.drawSquare(coordinate, color);
            }
        }
        
        drawSquare(coordinate, color) {
            let x = coordinate.x * this.squareSizeInPixels;
            let y = coordinate.y * this.squareSizeInPixels;
            this.context.fillStyle = color;
            this.context.beginPath();
            this.context.moveTo(x - (this.squareSizeInPixels / 2), y - (this.squareSizeInPixels / 2));
            this.context.lineTo(x + (this.squareSizeInPixels / 2), y - (this.squareSizeInPixels / 2));
            this.context.lineTo(x + (this.squareSizeInPixels / 2), y + (this.squareSizeInPixels / 2));
            this.context.lineTo(x - (this.squareSizeInPixels / 2), y + (this.squareSizeInPixels / 2));
            this.context.closePath();
            this.context.fill();
            this.isSplashScreenDisplayed = false;
        }
        
        /**
         *  Returns a random coordinate within the range of 1 to n, where n is scaled by this.squareSizeInPixels
         *  In terms of screen pixels, n * this.squareSizeInPixels = board width or height
         */
        getRandomCoordinate(excludedCoordinates) {
            let maxBoundingBoxUnitX = (this.width - this.squareSizeInPixels)/this.squareSizeInPixels;
            let maxBoundingBoxUnitY = (this.height - this.squareSizeInPixels)/this.squareSizeInPixels;
            let isValidCoordinate, coordinate;
            do {
                isValidCoordinate = true;
                coordinate = new Coordinate(this._getRandomIntegerInRange(1, maxBoundingBoxUnitX ),
                                                this._getRandomIntegerInRange(1, maxBoundingBoxUnitY ));
                for(let excludedCoordinate of excludedCoordinates) {
                    if(coordinate.equals(excludedCoordinate)) {
                        //Invalid coordinate found, retry
                        isValidCoordinate = false;
                        break;
                    }
                }
            } while (!isValidCoordinate);
            
            return coordinate;
            
        }
        
        isOutOfBounds(coordinate) {
            return (coordinate.x <= 0) ||
                   (coordinate.y <= 0) ||
                   (coordinate.x * this.squareSizeInPixels >= this.width) ||
                   (coordinate.y * this.squareSizeInPixels >= this.height);
        }
        
        showSplashScreen(title, message) {
            this.context.fillStyle = "lightgreen";
            this.context.font = (this.height / 10) + "px consolas";
            this.context.textAlign = "center";
            this.context.strokeStyle = "black";
            this.context.strokeText(title, this.width/2, this.height/4);
            this.context.fillText(title, this.width/2, this.height/4);
            this.context.strokeText(message, this.width/2, this.height*(3/4));
            this.context.fillStyle = "white";
            this.context.fillText(message, this.width/2, this.height*(3/4));
            this.isSplashScreenDisplayed = true;
        }
        
        _getRandomIntegerInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    return BoardView;

});     