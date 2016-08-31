// Gauge object

//namespace
this.brakeSimulator = this.brakeSimulator||{};

(function() {
	"use strict";

	//constructor
	function Gauge(radius, colour, maxScale, redNeedle=false) {
		//public properties
		this.gauge = new createjs.Container();
		//private properties
		this._radius = radius;
		this._colour = colour;
		this._maxScale = maxScale;
		this._redNeedle = redNeedle
		this._needleWhite = new brakeSimulator.GaugePointerWhite();
		this._needleRed = new brakeSimulator.GaugePointerRed();

		//drawGauge
		this._drawGauge();
		//add needles
		this._needleWhite.pointer.scaleX = this._needleWhite.pointer.scaleY = this._radius / 100;
		this.gauge.addChild(this._needleWhite.pointer);
		if (this._redNeedle) {
			this._needleRed.pointer.scaleX = this._needleRed.pointer.scaleY = this._radius / 100;
			this.gauge.addChild(this._needleRed.pointer);
		}

	}
	var p = Gauge.prototype;

	//public methods
	p.setNeedle = function(scale, type="white") {
		var tick = 315 / this._maxScale;
		var frameToGo = scale * tick;
		if (type == "white") {
			this._needleWhite.setPosition(frameToGo);
		} else {
			this._needleRed.setPosition(frameToGo);
		}
	};

	p.getNeedleValue = function(type="white") {
		var tick = 315 / this._maxScale;
		if (type == "white") {
			return this._needleWhite.getPosition() / tick;
		} else {
			return this._needleRed.getPosition() / tick;
		}
	};

	//private methods
	p._drawGauge = function() {
		var background = new createjs.Shape();
		var arcLength = 315, angle, segments, cx, cy, notch, dx, dy, size;
		var scale = [], kpa, gaugeLabel, i = 0, unit = this._maxScale / 10;
		var textContainer = new createjs.Container();

		background.graphics.ss(2).s(this._colour);
    	//draw outline
		background.graphics.drawCircle(0, 0, this._radius);
		background.graphics.moveTo(this._radius * 0.95, 0);
		background.graphics.drawCircle(0, 0, this._radius * 0.95);
		background.graphics.beginFill(this._colour).drawCircle(0, 0, 5 * (this._radius/100)).endFill();
		background.graphics.moveTo(-Math.sin(22.5 / 180 * Math.PI) * this._radius * 0.85, Math.cos(22.5 / 180 * Math.PI) * this._radius * 0.85);
		background.graphics.arc(0, 0, this._radius * 0.85, 112.5 * Math.PI / 180, 67.5 * Math.PI / 180);
    	//draw ticks - and scale;
    	angle = 22.5;
		segments = arcLength / 30;
		while (angle <= arcLength+22.5) {
			//start
			cx = -Math.sin(angle / 180 * Math.PI) * this._radius * 0.85;
			cy = Math.cos(angle / 180 * Math.PI) * this._radius * 0.85;
			//end
			notch = angle % (segments * 3) == 22.5 ? 0.75 : 0.8;
			dx = -Math.sin(angle / 180 * Math.PI) * this._radius * notch;
			dy = Math.cos(angle / 180 * Math.PI) * this._radius * notch;
			//draw tick
			background.graphics.moveTo(cx,cy);
			background.graphics.lineTo(dx,dy);
			//draw scale;
			if (notch == 0.75) {
				size = 12 * (this._radius / 100)
				scale[i] = new createjs.Text(i*unit+"", size + "px Arial");
				dx = -Math.sin(angle / 180 * Math.PI) * this._radius * (notch-0.05);
				dy = Math.cos(angle / 180 * Math.PI) * this._radius * (notch-0.05);
				//fix positioning
				switch (i) {
					case 0 :
						dy -= (scale[i].getMeasuredHeight()+1);
						break;
					case 1 :
					case 2 :
						dy -= (scale[i].getMeasuredHeight()+1) / 2;
						break;
					case 4 :
					case 5 :
					case 6 :
						dx -= (scale[i].getMeasuredWidth()+4) / 2;
						break;
					case 7 :
						dx -= (scale[i].getMeasuredWidth()+1);
						break;
					case 8 :
					case 9 :
						dx -= (scale[i].getMeasuredWidth()+4);
						dy -= (scale[i].getMeasuredHeight()+1) / 2;
						break;
					case 10 :
						dx -= (scale[i].getMeasuredWidth()+4) * 0.75;
						dy -= (scale[i].getMeasuredHeight()+1);
						break;
				}
				scale[i].x = dx;
		    	scale[i].y = dy;
				textContainer.addChild(scale[i]);
				i++;;
			}
			angle +=  segments;
		}
		//draw kpa;
		size = 20 * (this._radius / 100);
		kpa = new createjs.Text("kPa", "bold " + size + "px Arial");
		kpa.x = 0 - (kpa.getMeasuredWidth() + 4) / 2;
		kpa.y = this._radius / 4;
		textContainer.addChild(kpa);
		//add gauge label
		size = 14 * (this._radius / 100);
		gaugeLabel = new createjs.Text(this._redNeedle ? "Duplex Gauge":"Brake Cylinder", "bold " + size + "px Arial");
		gaugeLabel.x = 0 - (gaugeLabel.getMeasuredWidth() + 4) / 2;
		gaugeLabel.y = this._radius + 5;
		textContainer.addChild(gaugeLabel);

 		this.gauge.addChild(background, textContainer);
	};

	//add to namespace
	brakeSimulator.Gauge = Gauge;

}());
