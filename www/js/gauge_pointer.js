// Gauge pointer

//namespace
this.brakeSimulator = this.brakeSimulator||{};

(function() {
	"use strict";

	//constructor
	function GaugePointer() {
		//public properties
		this.pointer = new createjs.Shape();
		//private properties
		this._pos = 0;

		this.reset();
	}
	var p = GaugePointer.prototype;

	//public methods
	p.reset = function() {
		this._pos = 0;
		this.pointer.rotation = 203;
	};

	p.getPosition = function() {
		return this._pos;
	};

	p.setPosition = function(pos) {
		var time;
		//set timing equal to movement
		time = Math.abs(pos - this._pos) / 315;
		this._pos = pos;
		createjs.Tween.get(this.pointer, {override:true}).to({rotation:pos+203}, 15000*time, createjs.Ease.quartOut);
	};

	//add to namespace
	brakeSimulator.GaugePointer = GaugePointer;
}());

// White Pointer extends GaugePointer
(function() {
	"use strict";

	//constructor
	function GaugePointerWhite() {
		this.GaugePointer_constructor();
		this.pointer.graphics.ss(2).f("white").s("black").mt(0,0).lt(-5,-30).lt(0,-85).lt(5,-30).cp();
	}
	var p = brakeSimulator.extend(GaugePointerWhite, brakeSimulator.GaugePointer);

	//add to namespace
	brakeSimulator.GaugePointerWhite = brakeSimulator.promote(GaugePointerWhite, "GaugePointer");
}());

// Red Pointer extends GaugePointer
(function() {
	"use strict";

	//constructor
	function GaugePointerRed() {
		this.GaugePointer_constructor();
		this.pointer.graphics.ss(2).f("red").s("black").mt(0,0).lt(-5,-30).lt(0,-85).lt(5,-30).cp();
	}
	var p = brakeSimulator.extend(GaugePointerRed, brakeSimulator.GaugePointer);

	//add to namespace
	brakeSimulator.GaugePointerRed = brakeSimulator.promote(GaugePointerRed, "GaugePointer");
}());
