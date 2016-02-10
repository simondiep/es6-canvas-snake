define(function () {
    "use strict";

    // (0,0) is top-left
    var Direction = {
        UP :    {x:0, y:-1},
        DOWN :  {x:0, y:1},
        LEFT :  {x:-1,y:0},
        RIGHT : {x:1, y:0}
    };

    return Direction;

});     