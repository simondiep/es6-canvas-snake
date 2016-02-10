define([
    "view/canvas-view"
],

function (CanvasView) {
    "use strict";
    
    class CanvasViewFactory {
        
        createCanvasView(width, height) {
            let canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            document.getElementById("gameCanvas").appendChild(canvas);
            return new CanvasView(canvas);
        }
    }

    return CanvasViewFactory;

});     