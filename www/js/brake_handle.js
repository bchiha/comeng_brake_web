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
		var handle = [[30,20],[170,20],[175,15],[177,10],[178.5,5],[178.5,0],[177,-5],[175,-10],[170,-15],[30,-15]];
		var g = this._handle.graphics, dx, dy;
		g.f("white").dr(0, -40, 180, 80);
		g.f("#B93037").dc(0, 0, 60);
		g.f("black").dc(0, 0, 50);
		this._drawPoly(g, handle);
		g.ss(2).s("#00CC00");
		for (var i = 0; i < 11; i++) {
			dx = -Math.sin(10*i / 180 * Math.PI) * 50;
			dy = Math.cos(10*i / 180 * Math.PI) * 50;
			if (i >= 1 & i < 8) {
				g.s("white");
			} else if (i == 8) {
				g.s("#B93037");
			}
			if (!(i == 8 || i == 9)) {
				g.mt(0,0);
				g.lt(dx,dy);
			}
		};
		g.es().f("gray").dc(0, 0, 20);
		g.es().f("black").dc(0, 0, 5);
		this._handle.cursor = "pointer";
		var txtStep = new createjs.Text("Run & Rel", "20px Arial", "#00CC00");
		txtStep.y = 25;
		txtStep.x = 70;
		txtStep.name = "text";
		this.handleBase.addChild(this._handle, txtStep);
	};

	p._drawPoly = function(g, pts) {
		g.beginFill("black");
		g.mt(pts[0][0],pts[0][1]);
		for (var i = 1; i < pts.length; i++) {
			g.lt(pts[i][0], pts[i][1]);
		}
		g.es;;
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
			this.handleBase.dispatchEvent("moveHandle", true);
		}, this);

	};

	//add to namespace
	brakeSimulator.BrakeHandle = BrakeHandle;

}());
