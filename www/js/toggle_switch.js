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
		this._switch = new createjs.Container();
		this._onState = false;
		this._blackBit = new createjs.Shape();

		//draw the toggle switch
		var background = new createjs.Shape();
		background.graphics.ss(10).s("black").beginFill("white").drawRect(0, 0, 70, 40);
		var redBit = new createjs.Shape();
		redBit.graphics.beginFill("red").drawRect(5, 5, 30, 30);
		this._blackBit.graphics.beginFill("black").drawRect(5, 5, 30, 30);
		var txtState = new createjs.Text("EP C/B ON", "20px Arial", "#00CC00");
		txtState.lineWidth = 30;
		txtState.x = 725;
		txtState.y = 55;
		txtState.textAlign = "center";
		txtState.name = "text";

		this._switch.scaleY = 0.8;
		this._switch.x = 690;
		this._switch.y = 10;
		this._switch.cursor = "pointer";
		this._switch.addChild(background, redBit, this._blackBit, txtState);
		this.switchBase.addChild(this._switch, txtState);

		this._addEvents();
	}
	var p = ToggleSwitch.prototype;

	//public methods
	p.toggleIt = function() {
		var txtState = this.switchBase.getChildByName("text");
		this._onState = !this._onState;
		if (this._onState) {
			txtState.text = "EP C/B OFF";
			txtState.color = "#CC0000";
			createjs.Tween.get(this._blackBit).to({x:30}, 200);
		} else {
			txtState.text = "EP C/B ON";
			txtState.color = "#00CC00";
			createjs.Tween.get(this._blackBit).to({x:0}, 200);
		}
	};

	p.switchState = function() {
		return this._onState;
	};

	//private methods
	p._addEvents = function() {
		this._switch.on("click", function() {
			this.toggleIt();
			this.switchBase.dispatchEvent("clickToggle", true);
		}, this);

	};

	//add to namespace
	brakeSimulator.ToggleSwitch = ToggleSwitch;

}());
