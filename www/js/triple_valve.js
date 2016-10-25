// Triple Valve

//namespace
this.brakeSimulator = this.brakeSimulator||{};

(function() {
	"use strict";

	//constructor
	function TripleValve() {
		//public properties
		this.valveBase = new createjs.Container();
		//private properties
		this._slideValve = new createjs.Bitmap("img/tv/slideValve.png");
		this._tripleValve = new createjs.Bitmap("img/tv/tripleValve.png");
		this._auxFull = new createjs.Bitmap("img/tv/auxilaryFull.png");
		this._auxEmpty = new createjs.Bitmap("img/tv/auxilaryEmpty.png");
		this._auxMask = new createjs.Shape();
		this._brakeCylFull = new createjs.Bitmap("img/tv/brakeCylinderFull.png");
		this._brakeCylEmpty = new createjs.Bitmap("img/tv/brakeCylinderEmpty.png");
		this._brakeCylMask = new createjs.Shape();
		this._brakeBlock = new createjs.Bitmap("img/tv/brakeBlock.png");
		this._brakeSpring = new createjs.Bitmap("img/tv/brakeSpring.png");
		this._exhaustAir = new createjs.Bitmap("img/tv/exhaustAir.png");
		this._exhaustAirTop = new createjs.Bitmap("img/tv/exhaustAirTop.png");
		this._cylinderAir = new createjs.Bitmap("img/tv/cylinderAir.png");
		this._brakePipeAir = new createjs.Bitmap("img/tv/brakePipeAir.png");
		this._mainValveAirL = new createjs.Bitmap("img/tv/mainValveAirL.png");
		this._mainValveAirT = new createjs.Bitmap("img/tv/mainValveAirT.png");
		this._mainValveAirG = new createjs.Bitmap("img/tv/mainValveAirG.png");

 		//draw valve
		this._drawIt();

		this.valveBase.x = 200;
		this.valveBase.y = 280;
	}
	var p = TripleValve.prototype;

	//public methods
	p.slideIt = function(position, opening) {
		var opening = (typeof opening !== 'undefined') ?  opening : 0;
		var range=0;
		switch (position) {
			case "release" :
				createjs.Tween.get(this._slideValve,{override:true}).to({x:237}, 1000);
				createjs.Tween.get(this._brakeBlock,{override:true}).to({x:77}, 2000, createjs.Ease.quartOut);
				createjs.Tween.get(this._brakeSpring,{override:true}).to({scaleX:1}, 2000, createjs.Ease.quartOut);
				createjs.Tween.get(this._auxMask,{override:true}).to({scaleY:-1}, 5000, createjs.Ease.quartOut);
				createjs.Tween.get(this._brakeCylMask,{override:true}).to({scaleX:0}, 2000, createjs.Ease.quartOut);
				//air
				if (this._slideValve.x != 237) {
					createjs.Tween.get(this._exhaustAir,{override:true}).to({alpha:1}, 1000).to({alpha:0}, 1000);
					createjs.Tween.get(this._exhaustAirTop,{override:true}).to({x:245,alpha:1}, 1000).to({alpha:0}, 1000);
					createjs.Tween.get(this._cylinderAir,{override:true}).wait(1000).to({alpha:0}, 1000);
				}
				createjs.Tween.get(this._mainValveAirT,{override:true}).to({x:237}, 1000);
				createjs.Tween.get(this._brakePipeAir,{override:true}).to({alpha:1}, 1000);
				break;
			case "lap" :
				range = 257 + Math.round(10 * opening);
				//slide valve to opening position then to lap possition;
				createjs.Tween.get(this._slideValve,{override:true}).to({x:range}, 1000).to({x:257}, 1000);
				//aux tank full range is 140px and 550kpa, BP range is 140kPa. 
				createjs.Tween.get(this._auxMask,{override:true}).to({scaleY:-1 * ((550 - (150*opening)) / 550)}, 1000);
				//brake block x from 0 to 55, Cylinder from 17 to 200
				createjs.Tween.get(this._brakeCylMask,{override:true}).to({scaleX:-1 * opening}, 1000);
				createjs.Tween.get(this._brakeBlock,{override:true}).to({x:77 - (57 * opening)}, 1000);
				createjs.Tween.get(this._brakeSpring,{override:true}).to({scaleX:1 - opening}, 1000);
				//air
				createjs.Tween.get(this._exhaustAir,{override:true}).to({alpha:0}, 1000);
				createjs.Tween.get(this._exhaustAirTop,{override:true}).to({x:265,alpha:0}, 1000);
				createjs.Tween.get(this._cylinderAir,{override:true}).to({alpha:1}, 0);
				createjs.Tween.get(this._mainValveAirT,{override:true}).to({x:range}, 1000).to({x:257}, 1000);
				createjs.Tween.get(this._brakePipeAir,{override:true}).to({alpha:(1-((opening*140)/300))}, 1000);
				break;
			case "applied" :
				createjs.Tween.get(this._slideValve,{override:true}).to({x:277}, 1000);
				//set aux to 425kPa
				createjs.Tween.get(this._auxMask,{override:true}).to({scaleY:-1 * (400/550)}, 2000, createjs.Ease.quartOut);
				createjs.Tween.get(this._brakeCylMask,{override:true}).to({scaleX:-1}, 2000);
				createjs.Tween.get(this._brakeBlock,{override:true}).to({x:20}, 2000);
				createjs.Tween.get(this._brakeSpring,{override:true}).to({scaleX:0}, 2000);
				//air
				createjs.Tween.get(this._exhaustAir,{override:true}).to({alpha:0}, 1000);
				createjs.Tween.get(this._exhaustAirTop,{override:true}).to({x:285,alpha:0}, 1000);
				createjs.Tween.get(this._cylinderAir,{override:true}).to({alpha:1}, 0);
				createjs.Tween.get(this._mainValveAirT,{override:true}).to({x:277}, 1000);
				createjs.Tween.get(this._brakePipeAir,{override:true}).to({alpha:0}, 1000);
				break;
		}
	};

	//private methods
	p._drawIt = function() {
		//add triple valve
		this._tripleValve.x = 0;
		this._tripleValve.y = 0;
		this.valveBase.addChild(this._tripleValve);
		//add auxiliry tank
		this._auxEmpty.x = this._auxFull.x = this._auxMask.x = 10;
		this._auxEmpty.y = this._auxFull.y = 65;
		this._auxMask.graphics.r(0, 0, 183, 73);
		this._auxMask.y = 138;
		this._auxMask.scaleY = 0;
		this._auxFull.mask = this._auxMask;
		this.valveBase.addChild(this._auxEmpty, this._auxFull, this._auxMask);
		//add brake cylinder
		this._brakeCylEmpty.x = this._brakeCylFull.x = 120;
		this._brakeCylEmpty.y = this._brakeCylFull.y = this._brakeCylMask.y = 255;
		this._brakeCylMask.graphics.r(0, 0, 73, 73);
		this._brakeCylMask.x = 193;
		this._brakeCylMask.scaleX = 0;
		this._brakeCylFull.mask = this._brakeCylMask;
		this._brakeBlock.x = 77;
		this._brakeBlock.y = 235;
		this._brakeSpring.x = 125;
		this._brakeSpring.y = 275;
		this.valveBase.addChild(this._brakeCylEmpty, this._brakeCylFull, this._brakeCylMask, this._brakeBlock, this._brakeSpring);
		//add air
		this._brakePipeAir.x = 4;
		this._brakePipeAir.y = 2;
		this._mainValveAirL.x = 189;
		this._mainValveAirL.y = 117;
		this._mainValveAirG.x = 342;
		this._mainValveAirG.y = 107;
		this.valveBase.addChild(this._brakePipeAir, this._mainValveAirL, this._mainValveAirG);
		//add slide valve
		this._slideValve.x = 237;
		this._slideValve.y = 116;
		this.valveBase.addChild(this._slideValve);
		//add air south
		this._exhaustAir.x = 302;
		this._exhaustAir.y = 195;
		this._exhaustAir.alpha = 0;
		this._exhaustAirTop.x = 245;
		this._exhaustAirTop.y = 175;
		this._exhaustAirTop.alpha = 0;
		this._cylinderAir.x = 190;
		this._cylinderAir.y = 195;
		this._cylinderAir.alpha = 0;
		this._mainValveAirT.x = 237;
		this._mainValveAirT.y = 117;
		this.valveBase.addChild(this._exhaustAir, this._exhaustAirTop, this._cylinderAir, this._mainValveAirT);
	};

	//add to namespace
	brakeSimulator.TripleValve = TripleValve;

}());
