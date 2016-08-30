// Gauge pointer

var GaugePointer = function() {
	this.pos = 0;
	this.completed = true;
	this.pointer = new createjs.Shape();

	this.reset();
};

GaugePointer.prototype = {
	reset : function() {
		this.pos = 0;
		this.pointer.rotation = 203;
	},

	getPosition : function() {
		return this.pos;
	},

	setPosition : function(pos) {
		var time;
		//set timing equal to movement
		time = Math.abs(pos - this.pos) / 315;
		this.pos = pos;
		createjs.Tween.get(this.pointer, {override:true}).to({rotation:pos+203}, 15000*time, createjs.Ease.quartOut);
	}
};

// White Pointer extends GaugePointer
var GaugePointerWhite = function() {
	GaugePointer.call(this);

	//draw white needle
	this.pointer.graphics.ss(2).f("white").s("black").mt(0,0).lt(-5,-30).lt(0,-85).lt(5,-30).cp();
};

GaugePointerWhite.prototype = Object.create(GaugePointer.prototype);
GaugePointerWhite.prototype.constructor = GaugePointerWhite;

// Red Pointer extends GaugePointer
var GaugePointerRed = function() {
	GaugePointer.call(this);

	//draw red needle
	this.pointer.graphics.ss(2).f("red").s("black").mt(0,0).lt(-5,-30).lt(0,-85).lt(5,-30).cp();
};

GaugePointerRed.prototype = Object.create(GaugePointer.prototype);
GaugePointerRed.prototype.constructor = GaugePointerRed;

