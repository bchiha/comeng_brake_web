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
		var preback = new createjs.Shape();
		preback.graphics.f("black").r(0, 0, stage.canvas.width, stage.canvas.height);
		preback.alpha = 0.3;
		var background = new createjs.Bitmap("img/bv/releasePreventionValve.png");
		background.x = stage.canvas.width/2 - background.getBounds().width/2;
		background.y = stage.canvas.height/2 - background.getBounds().height/2;

		//doto complete and removed
		//background.graphics.ss(5).s("black").beginFill("white").drawRoundRect(400, 0, 220, 370, 10);
		var uTxt = new createjs.Text("Usage:", "bold 18px Arial", "blue");
		uTxt.x = 15;
		uTxt.y = 20;
		var usageTxt = new createjs.Text("Click and drag BVIC and Brake Handle with mouse.  Click E/P CB to toggle", "16px Arial", "black");
		usageTxt.lineWidth = 200;
		usageTxt.x = 15;
		usageTxt.y = 45;
		var kTxt = new createjs.Text("Keyboard Shortcuts:", "bold 18px Arial", "blue");
		kTxt.x = 15;
		kTxt.y = 110;
		var keyboardTxt = new createjs.Text("O,C   -- Open/Close BVIC  E       -- Toggle E/P CB       0       -- Run & Release     1-7    -- EP Braking Step      8       -- Emergency", "16px Arial", "black");
		keyboardTxt.lineWidth = 200;
		keyboardTxt.x = 15;
		keyboardTxt.y = 135;
		var sTxt = new createjs.Text("Simulation Shortcuts:", "bold 18px Arial", "blue");
		sTxt.x = 15;
		sTxt.y = 230;
		var simulationTxt = new createjs.Text("G        -- Gauges                   T         -- Triple Valve           B      \t  -- Brake Valve", "16px Arial", "black");
		simulationTxt.lineWidth = 200;
		simulationTxt.x = 15;
		simulationTxt.y = 255;
		var copyrightTxt = new createjs.Text("\u00A9 Brian Chiha 2016 brian.chiha@gmail.com", "bold 16px Arial", "black");
		copyrightTxt.lineWidth = 150;
		copyrightTxt.x = 220 / 2;
		copyrightTxt.y = 320;
		copyrightTxt.textAlign = "center";

		this.helpInfo.scaleY = this.helpInfo.scaleX = 0.1;
		this.helpInfo.alpha = 0;
		this.helpInfo.x = this.helpInfo.regX = stage.canvas.width/2;
		this.helpInfo.y = this.helpInfo.regY = stage.canvas.height/2;
		this.helpInfo.addChild(preback, background, uTxt, usageTxt, kTxt, keyboardTxt, sTxt, simulationTxt, copyrightTxt);

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
