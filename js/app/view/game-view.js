define([
    "model/direction"
],

function (Direction) {
    "use strict";
    
    const ENTER_KEYCODE = 13;
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
    
    class GameView {
        
        constructor(startNewGameCallback, changeDirectionCallback, isSplashScreenDisplayedCallback, updatePlayerNameCallback) {
            this.startNewGameCallback = startNewGameCallback;
            this.changeDirectionCallback = changeDirectionCallback;
            this.isSplashScreenDisplayedCallback = isSplashScreenDisplayedCallback;
            this.updatePlayerNameCallback = updatePlayerNameCallback;
            this._initializePlayerName();
            window.addEventListener( "keydown", this._handleKeyDown.bind(this), true);
        }
        
        getPlayerName() {
            return this._getPlayerNameElement().value;
        }
        
        hideChangeNameButton() {
            this._getChangeNameButton().style.display = "none";
        }
        
        showChangeNameButton() {
            this._getChangeNameButton().style.display = "inline";
        }
        
        _initializePlayerName() {
            this.isChangingName = false;
            let playerName = "Player 1";
            this._getPlayerNameElement().value = playerName;
            this._getChangeNameButton().addEventListener('click', this._handleChangeNameButtonClick.bind(this), false);
        }
        
        _getChangeNameButton() {
            return document.getElementById("changePlayerNameButton");
        }
        
        _getInvalidPlayerNameLabel() {
            return document.getElementById("invalidPlayerNameLabel");
        }
        
        _getPlayerNameElement() {
            return document.getElementById("playerName");
        }
        
        _handleChangeNameButtonClick(button) {
            if(this.isChangingName) {
                this._saveNewPlayerName();
            } else {
                this._getChangeNameButton().innerHTML = "Save";
                this._getPlayerNameElement().readOnly = false;
                this._getPlayerNameElement().select();
                this.isChangingName = true;
            }
        }
        
        _handleKeyDown(e) {
            // Prevent space bar scrolling default behavior
            if (e.keyCode === SPACE_BAR_KEYCODE && e.target == document.body) {
                e.preventDefault();
            }
            
            // When changing names, save new name on enter
            if(e.keyCode === ENTER_KEYCODE && this.isChangingName) {
                this._saveNewPlayerName();
                document.activeElement.blur();
                return;
            }
        
            if(this.isSplashScreenDisplayedCallback()) {
                if(e.keyCode === SPACE_BAR_KEYCODE && !this.isChangingName) {
                    this.startNewGameCallback();
                }
            } else {
                let newDirection = KEYCODE_TO_DIRECTION[e.keyCode];
                this.changeDirectionCallback(newDirection);
            }
        }
        
        _saveNewPlayerName() {
            let playerName = this._getPlayerNameElement().value;
            if(playerName && playerName.trim().length > 0) {
                this.updatePlayerNameCallback(playerName);
                this._getChangeNameButton().innerHTML = "Change Name";
                this._getPlayerNameElement().readOnly = true;
                this.isChangingName = false;
                this._getInvalidPlayerNameLabel().style.display = "none";
            } else {
                this._getInvalidPlayerNameLabel().style.display = "inline";
            }
        }
    }

    return GameView;

});     