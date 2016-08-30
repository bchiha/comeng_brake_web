// Toggle Swtich for EP C/b

var ToggleSwitch = function() {
	this.onState = false;
	this.switchBase = new createjs.Container();
	this.blackBit = new createjs.Shape();

	//draw the help icon
	var background = new createjs.Shape();
	background.graphics.ss(10).s("black").beginFill("white").drawRect(0, 0, 70, 40);
	var redBit = new createjs.Shape();
	redBit.graphics.beginFill("red").drawRect(5, 5, 30, 30);
	this.blackBit.graphics.beginFill("black").drawRect(5, 5, 30, 30);

	this.switchBase.scaleY = 0.8;
	this.switchBase.addChild(background, redBit, this.blackBit);
};

ToggleSwitch.prototype = {
	toggleIt : function() {
		this.onState = !this.onState;
		if (this.onState) {
			createjs.Tween.get(this.blackBit).to({x:30}, 200);
		} else {
			createjs.Tween.get(this.blackBit).to({x:0}, 200);
		}
	}, 

	switchState : function() {
		return this.onState;
	}
};