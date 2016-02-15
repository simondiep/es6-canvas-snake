define(function () {
    "use strict";

    class Food {
        constructor(coordinate, color) {
            this.location = coordinate;
            this.color = color;
        }
        
        setLocation(coordinate) {
            this.location = coordinate;
        }
    }

    return Food;

});     