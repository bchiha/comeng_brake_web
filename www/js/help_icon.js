// Help panel

var HelpIcon = function() {
	this.helpInfo = new createjs.Container();

	//draw the help icon
	var background = new createjs.Shape();
	background.graphics.ss(5).s("black").beginFill("white").drawRoundRect(0, 0, 220, 290, 10);
	var uTxt = new createjs.Text("Usage:", "bold 18px Arial", "blue");
	uTxt.x = 15;
	uTxt.y = 20;
	var usageTxt = new createjs.Text("Click and drag BVIC and Brake Handle with mouse.  Click E/P CB to toggle", "16px Arial", "black");
	usageTxt.lineWidth = 200;
	usageTxt.x = 15;
	usageTxt.y = 50;
	var kTxt = new createjs.Text("Keyboard Shortcuts:", "bold 18px Arial", "blue");
	kTxt.x = 15;
	kTxt.y = 110;
	var keyboardTxt = new createjs.Text("O,C   -- Open/Close BVIC  E       -- Toggle E/P CB       0       -- Run & Release     1-7    -- EP Braking Step      8       -- Emergency", "16px Arial", "black");
	keyboardTxt.lineWidth = 200;
	keyboardTxt.x = 15;
	keyboardTxt.y = 140;
	var copyrightTxt = new createjs.Text("\u00A9 Brian Chiha 2016 brian.chiha@gmail.com", "bold 16px Arial", "black");
	copyrightTxt.lineWidth = 150;
	copyrightTxt.x = 220 / 2;
	copyrightTxt.y = 240;
	copyrightTxt.textAlign = "center";

	this.helpInfo.scaleY = this.helpInfo.scaleX = 0.1;
	this.helpInfo.alpha = 0;
	this.helpInfo.x = 770;
	this.helpInfo.y = 20;
	this.helpInfo.addChild(background, uTxt, usageTxt, kTxt, keyboardTxt, copyrightTxt);
};

HelpIcon.prototype = {
	onHelp : function(mouseIs) {
		if (mouseIs == "over") {
			//this.helpInfo.x = -100;
			//this.helpInfo.y = 170;
			//this.scaleX = this.scaleY = 0.1;
			//this.alpha = 0;
			stage.addChild(this.helpInfo);
			createjs.Tween.get(this.helpInfo).to({scaleX:1, scaleY:1, alpha:1}, 500);
		} else {
			if (stage.getChildIndex(this.helpInfo) != -1) {
				createjs.Tween.get(this.helpInfo).to({scaleX:0.1, scaleY:0.1, alpha:0}, 500).call(function() {stage.removeChild(this.HelpIcon)});
			}
		}
	}
};