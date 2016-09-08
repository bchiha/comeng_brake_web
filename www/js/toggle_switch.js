// Toggle Swtich for EP C/B

//namespace
this.brakeSimulator = this.brakeSimulator||{};

(function() {
	"use strict";

	//constructor
	function ToggleSwitch() {
		//public properties
		this.switchBase = new createjs.Container();
		//private properties
		this._onState = false;
		this._blackBit = new createjs.Shape();

		//draw the toggle switch
		var background = new createjs.Shape();
		background.graphics.ss(10).s("black").beginFill("white").drawRect(0, 0, 70, 40);
		var redBit = new createjs.Shape();
		redBit.graphics.beginFill("red").drawRect(5, 5, 30, 30);
		this._blackBit.graphics.beginFill("black").drawRect(5, 5, 30, 30);

		this.switchBase.scaleY = 0.8;
		this.switchBase.x = 690;
		this.switchBase.y = 10;
		this.switchBase.cursor = "pointer";
		this.switchBase.addChild(background, redBit, this._blackBit);

		this._addEvents();
	}
	var p = ToggleSwitch.prototype;

	//public methods
	p.toggleIt = function() {
		this._onState = !this._onState;
		if (this._onState) {
			createjs.Tween.get(this._blackBit).to({x:30}, 200);
		} else {
			createjs.Tween.get(this._blackBit).to({x:0}, 200);
		}
	};

	p.switchState = function() {
		return this._onState;
	};

	//private methods
	p._addEvents = function() {
		this.switchBase.on("click", function() {
			this.toggleIt();
			this.switchBase.dispatchEvent("clickToggle", true);
		}, this);

	};

	//add to namespace
	brakeSimulator.ToggleSwitch = ToggleSwitch;

}());
