// Brake Handle

//namespace
this.brakeSimulator = this.brakeSimulator||{};

(function() {
	"use strict";

	//constructor
	function BrakeHandle() {
		//public properties
		this.handleBase = new createjs.Container();
		//private properties
		this._handle = new createjs.Shape();
		this._step = 0;
 		this._onAir = false;
 		this._increment = 10; //step increment
 		this._max_brake_pressure = 275; //emergency in kPa

 		//drawHandle
		this._drawHandle();

		this.handleBase.x = 100;
		this.handleBase.y = 200;
		//this.handleBase.regX = 35/2*1.2;
		//this.handleBase.regY = 15/2*1.1;

		this._addEvents();
	}
	var p = BrakeHandle.prototype;

	//public methods
	p.step = function() {
		if (this._onAir) {
			return Math.ceil(this.handleBase.rotation) * -1;
		} else {
			return this.handleBase.rotation / this._increment * -1;
		}
	};

	p.stepTo = function(step) {
		var rot = 0;
		if (step < 0 || step > 8) {
			return;
		}
		if (step == 8) {
			rot = -100;
		} else {
			rot = step * -10;
		}
		this.handleBase.rotation = rot;
		createjs.Tween.get(this.handleBase).to({rotation:rot}, 500);
		this._updateText();
	};

	p.setAir = function(onAir) {
		this._onAir = onAir;
	};

	//private methods
	p._drawHandle = function() {
		var hexigon = [[0,0],[0,15],[10,25],[25,25],[35,15],[35,0],[25,-10],[10,-10],[0,0]];
		var handle = [[30,20],[120,20],[125,15],[127.5,10],[127.5,5],[125,0],[120,-5],[30,-5]];
		var g = this._handle.graphics;
		this._drawPoly(g, handle);
		this._drawPoly(g, hexigon);
		g.mt(25,10).bf("gray").dc(35/2,15/2,7.5);
		this._handle.scaleX = 1.2;
		this._handle.scaleY = 1.1;
		this._handle.cursor = "pointer";
			// 		graphics.lineStyle( 3, 0x0074B9 );
			// DrawingShapes.drawPolygon( graphics, 100, 267, 3, 5,-30 );
		var txtStep = new createjs.Text("Run & Rel", "20px Arial", "#00CC00");
		txtStep.y = 30;
		txtStep.x = 40;
		txtStep.name = "text";
		this.handleBase.addChild(this._handle, txtStep);
	};

	p._drawPoly = function(g, pts) {
		g.ss(3).s("black").beginFill("gray");
		g.mt(pts[0][0],pts[0][1]);
		for (var i = 1; i < pts.length; i++) {
			g.lt(pts[i][0], pts[i][1]);
		}
		g.es;
	};
	
	p._updateText = function() {
		var step_txt = "Run & Rel";
		var step_val = this.step();
		var txtStep = this.handleBase.getChildByName("text");
		if (step_val == 0) {
			txtStep.color = "#00CC00";
		} else if ((step_val == 10 && !this._onAir) || step_val == 100) {
			txtStep.color = "#CC0000";
			step_txt = "Emergency";
		} else {
			txtStep.color = "#0000CC";
			if (this._onAir) {
				step_txt = Math.round(step_val * (this._max_brake_pressure / 70)) + "kPa";
			} else {
				step_txt = "Step " + step_val;
			}
		}
		txtStep.text = step_txt;
	};

	p._checkRotation = function(rot) {
		return (rot <= 0 && rot >= -70) || rot == -100;
 	};

 	p._checkStep = function(step) {
 		return (step >= 0 && step <= 7) || step == 10;
	};

	p._addEvents = function() {
		this._handle.on("pressmove", function() {
			var dx = stage.mouseX - this.handleBase.x;
 			var dy = stage.mouseY - this.handleBase.y;
 			var rot = Math.round(Math.atan2(dy,dx) * 180 / Math.PI);
 			if (this._onAir) {
 				if (this._checkRotation(rot)) {
 					this.handleBase.rotation = rot;
 				}
 			} else {
 				if (rot % this._increment == 0 && this._checkStep(rot / -10.0)) {
 					this.handleBase.rotation = rot;
 				}
 			}
 			this._updateText();
		}, this);

	};

	//add to namespace
	brakeSimulator.BrakeHandle = BrakeHandle;

}());
