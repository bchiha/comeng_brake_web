// BVIC - Brake Valve and Isolating Cock

//namespace
this.brakeSimulator = this.brakeSimulator||{};

(function() {
	"use strict";

	//constructor
	function BVIC() {
		//public properties
		this.cockBase = new createjs.Container();
		//private properties
		this._handle = new createjs.Shape();
		this._isClosed = true;
 		this._maxRotation = -90;

 		//drawHandle
		this._drawHandle();

		this.cockBase.x = 350;
		this.cockBase.y = 200;
		this.cockBase.regX = 35/2*1.2;
		this.cockBase.regY = 15/2*1.1;

		this._addEvents();
	}
	var p = BVIC.prototype;

	//public methods
	p.isOpen = function() {
		return !this._isClosed;
	};

	p.isClosed = function() {
		return this._isClosed;
	};

	p.setToOpen = function() {
		if (this.cockBase.rotation != this._maxRotation) {
			createjs.Tween.get(this.cockBase).to({rotation:-90}, 1000);
		}
 		this._isClosed = false;
 		this._updateText();
	};

	p.setToClosed = function() {
		if (this.cockBase.rotation != 0) {
			createjs.Tween.get(this.cockBase).to({rotation:0}, 1000);
		}
 		this._isClosed = true;
 		this._updateText();		
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
		var txtStatus = new createjs.Text("BVIC Closed", "20px Arial", "#0000CC");
		txtStatus.y = 30;
		txtStatus.x = 40;
		txtStatus.name = "text";
		this.cockBase.addChild(this._handle, txtStatus);
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
		var txtStatus = this.cockBase.getChildByName("text");
		if (this._isClosed) {
			txtStatus.text = "BVIC Closed";
			txtStatus.color = "#0000CC";
		} else {
			txtStatus.text = "BVIC Open";
			txtStatus.color = "#00CC00";
		}
	};

	p._checkRotation = function(rot) {
 		return (rot >= this._maxRotation && rot <= 0);
 	};

 	p._updateStatus = function(rot) {
		this._isClosed = rot != -90;
	};

	p._addEvents = function() {
		this._handle.on("pressmove", function() {
			var dx = stage.mouseX - this.cockBase.x;
 			var dy = stage.mouseY - this.cockBase.y;
 			var rot = Math.round(Math.atan2(dy,dx) * 180 / Math.PI);
			if (rot <= -80) { rot = -90; }
			if (rot >= -10) { rot = 0; }
 			if (this._checkRotation(rot)) {
				this.cockBase.rotation = rot;
 				this._updateStatus(rot);
 			}
 			this._updateText();
		}, this);

	};

	//add to namespace
	brakeSimulator.BVIC = BVIC;

}());
