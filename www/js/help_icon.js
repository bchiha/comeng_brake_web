// Help panel

//namespace
this.brakeSimulator = this.brakeSimulator||{};

(function() {
	"use strict";

	//constructor
	function HelpIcon() {
		//public properties
		this.helpInfo = new createjs.Container();

		//draw the help icon
		var background = new createjs.Shape();
		background.graphics.f("black").r(0, 0, stage.canvas.width, stage.canvas.height);
		background.alpha = 0.3;
		var message = new createjs.Bitmap("img/help_msg.png");
		message.x = stage.canvas.width/2 - 300/2;
		message.y = stage.canvas.height/2 - 450/2;

		this.helpInfo.scaleY = this.helpInfo.scaleX = 0.1;
		this.helpInfo.alpha = 0;
		this.helpInfo.x = this.helpInfo.regX = stage.canvas.width/2;
		this.helpInfo.y = this.helpInfo.regY = stage.canvas.height/2;
		this.helpInfo.addChild(background, message);

		this._addEvents();
	}
	var p = HelpIcon.prototype;

	//public methods
	p.onHelp = function() {
		if (this.helpInfo.alpha==1) {
			createjs.Tween.get(this.helpInfo).to({scaleX:0.1, scaleY:0.1, alpha:0}, 500).call(function() {stage.removeChild(this.helpInfo)});
		} else {
			stage.addChild(this.helpInfo);
			createjs.Tween.get(this.helpInfo).to({scaleX:1, scaleY:1, alpha:1}, 500);
		}
	};

	//private methods
	p._addEvents = function() {
		//mouse click (hide help)
		this.helpInfo.on("click", function(event) {
			this.onHelp(); //toggle it off as alpha must be 1 to be clicked
		}, this);
	};

	//add to namespace
	brakeSimulator.HelpIcon = HelpIcon;

}());
