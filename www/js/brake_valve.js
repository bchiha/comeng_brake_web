// Brake Valve

//namespace
this.brakeSimulator = this.brakeSimulator||{};

(function() {
	"use strict";

	//constructor
	function BrakeValve() {
		//public properties
		this.valveBase = new createjs.Container();
		//private properties
		this._activeComp = {name:"",component:null,origX:0,origY:0}; //name, components, orig x, orig y 
		this._isActive = {chargingValve:false,relayValve:false,regulatingValve:false,bvic:false,rpValve:false,lomv:false};
		this._previousPressure = 0
		this._previousStep = 0;
		//valves
		this._chargingValveBase = new createjs.Container();
		this._chargingValve = new createjs.Bitmap("img/bv/chargingValve.png");
		this._chargingValveSlider = new createjs.Bitmap("img/bv/chargingValveSlider.png");
		this._bvicBase = new createjs.Container();
		this._bvic = new createjs.Bitmap("img/bv/bviCock.png");
		this._bvicSlider = new createjs.Bitmap("img/bv/bviCockSlider.png");
		this._lomvBase = new createjs.Container();
		this._lomv = new createjs.Bitmap("img/bv/lomv.png");
		this._lomvSlider = new createjs.Bitmap("img/bv/lomvSlider.png");
		this._lomvBall = new createjs.Bitmap("img/bv/lomvBall.png");
		this._rpValveBase = new createjs.Container();
		this._rpValve = new createjs.Bitmap("img/bv/releasePreventionValve.png");
		this._rpValveSlider = new createjs.Bitmap("img/bv/releasePreventionValveSlider.png");
		this._airRPOut = new createjs.Bitmap("img/bv/airReleasePreventionOut.png");
		this._airRPIn = new createjs.Bitmap("img/bv/airReleasePreventionIn.png");
		this._regulatingValveBase = new createjs.Container();
		this._regulatingValve = new createjs.Bitmap("img/bv/regulatingValve.png");
		this._regulatingValveSlider = new createjs.Bitmap("img/bv/regulatingValveSlider.png");
		this._regulatingValveLevel = new createjs.Bitmap("img/bv/regulatingValveLevel.png");
		this._airRegV = new createjs.Bitmap("img/bv/airRegulatingValve.png");
		this._airRegVJ = new createjs.Bitmap("img/bv/airRegulatingValveJ.png");
		this._relayValveBase = new createjs.Container();
		this._relayValve = new createjs.Bitmap("img/bv/relayValve.png");
		this._relayValveDiapham = new createjs.Bitmap("img/bv/relayValveDiapham.png");
		this._relayValveChargeFlap = new createjs.Bitmap("img/bv/relayValveChargeFlap.png");
		this._relayValveExhaustFlap = new createjs.Bitmap("img/bv/relayValveExhaustFlap.png");
		this._airRVBP = new createjs.Bitmap("img/bv/airRelayValveBp.png");
		this._airRVEQ = new createjs.Bitmap("img/bv/airRelayValveEq.png");

		this._compTextBase = new createjs.Container();
		this._fullSimulation = new createjs.Shape();

		//set info for components, starting x, y
		this._chargingValveInfo = {origX:0,origY:160,desc:"Charge/Emerg. Exhuast Valve"};
		this._relayValveInfo = {origX:0,origY:0,desc:"Relay Valve"};
		this._lomvInfo = {origX:0,origY:270,desc:"Lockout Magnet Valve"};
		this._rpValveInfo = {origX:750,origY:20,desc:"Release Prevention Valve"};
		this._bvicInfo = {origX:750,origY:150,desc:"BVIC"};
		this._regulatingValveInfo = {origX:720,origY:270,desc:"Regulating Valve"};

 		//draw valve
		this._drawIt();

		this.valveBase.x = 75;
		this.valveBase.y = 300;

		this._addEvents();
	}
	var p = BrakeValve.prototype;

	//public methods
	p.animateIt = function(position, pressure, step, onAir, bvicOpen) {
		//animate the active components
		var tl = new createjs.Timeline([], null, {paused:true});
		var pressurePercent = Math.abs(550 - pressure) / 140;
		if (pressurePercent == 0) {
			this._previousPressure = 550;
		}
		if (step == 0) {
			this._previousStep = 0;
		}
		//charging valve
		if (this._isActive.chargingValve) {
			if (position == "emergency") {
				tl.addTween(
					createjs.Tween.get(this._chargingValveSlider, {override:true}).to({x:30}, 500)
					// tl.to([this.airCVOpen, this.airCVtoRV], 0, {alpha:0}, 0);
					// tl.to([this.airCVClosed,this.airCVtoE], 1, {alpha:1}, 0.5);
					// tl.to([this.airCVClosed,this.airCVtoE], 1, {alpha:0}, 1.5);
				);
			} else {
				tl.addTween(
					createjs.Tween.get(this._chargingValveSlider, {override:true}).to({x:0}, 500)
					// tl.to([this.airCVOpen,this.airCVtoRV], 0.5, {alpha:1}, 0.5);
				);
			}
		}
		//bvic
		if (this._isActive.bvic) {
			if (bvicOpen) {
				tl.addTween(createjs.Tween.get(this._bvicSlider, {override:true}).to({x:0}, 500));
			} else {
				tl.addTween(createjs.Tween.get(this._bvicSlider, {override:true}).to({x:15}, 500));
			}
		}
		//lockout magnet valve
		if (this._isActive.lomv) {
			if (onAir) {
				tl.addTween(
					createjs.Tween.get(this._lomvSlider, {override:true}).to({y:30}, 500),
					createjs.Tween.get(this._lomvBall, {override:true}).to({x:27,y:72}, 500)
				);
				if (pressure < this._previousPressure || position == "release") {
						//tl.to(this.airLomv, 1, {alpha:(1-((pressurePercent*7)/15))}, 0);
				}
			} else {
				tl.addTween(
					createjs.Tween.get(this._lomvSlider, {override:true}).to({y:5}, 500)
					//tl.to(this.airLomv, 1, {alpha:1}, 0);
				);
				if (this._lomvBall.y == 72 || position == "release") {
					tl.addTween(
						createjs.Tween.get(this._lomvBall, {override:true}).to({y:47}, 500).to({x:32}, 1000).to({x:27}, 500)
					);
				}
			}
		}
		//release prevention valve
		if (this._isActive.rpValve) {
			if (position == "release") {
				tl.addTween(
					createjs.Tween.get(this._rpValveSlider, {override:true}).to({x:13}, 500),
					createjs.Tween.get(this._airRPOut, {override:true}).to({alpha:1}, 500)
					//createjs.Tween.get(this._airRPtoRV, {override:true}).to({alpha:1}, 500)
				);
			} else {
				tl.addTween(
					createjs.Tween.get(this._rpValveSlider, {override:true}).to({x:24}, 500),
					createjs.Tween.get(this._airRPOut, {override:true}).wait(500).to({alpha:0}, 500)
					//createjs.Tween.get(this._airRPtoRV, {override:true}).wait(500).to({alpha:0}, 500)
				);
			}
		}
		//regulating valve
		if (this._isActive.regulatingValve) {
			if (step > 7) {
				step = 7;
			}
			if (pressurePercent > 1) {
				pressurePercent = 1;
			}
			if (pressure < this._previousPressure || (step > this._previousStep && ! onAir)) {
				tl.addTween(
					createjs.Tween.get(this._regulatingValveSlider, {override:true}).to({x:0}, 1000, createjs.Ease.sineOut).to({x:10}, 1000, createjs.Ease.sineOut)
				);
				if (onAir) {
					tl.addTween(
						createjs.Tween.get(this._airRegV, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
						//createjs.Tween.get(this._airRVtoLM, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
						createjs.Tween.get(this._airRegVJ, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000).to({alpha:0}, 1000)
					);
				} else {
					tl.addTween(
						createjs.Tween.get(this._airRegV, {override:true}).to({alpha:(1-(step/15))}, 1000),
						//createjs.Tween.get(this._airRVtoLM, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
						createjs.Tween.get(this._airRegVJ, {override:true}).to({alpha:(1-(step/15))}, 1000).to({alpha:0}, 1000)
					);
				}
			}
			if (position == "release") {
				tl.addTween(
					createjs.Tween.get(this._airRegV, {override:true}).to({alpha:1}, 1000)
					//createjs.Tween.get(this._airRVtoLM, {override:true}).to({alpha:1}, 1000)
				);
			}
			if (! onAir) {
				tl.addTween(createjs.Tween.get(this._regulatingValveLevel, {override:true}).to({scaleY:1-step/7}, 500));
			} else if (pressurePercent >= 0 && pressurePercent <= 1) {
				tl.addTween(createjs.Tween.get(this._regulatingValveLevel, {override:true}).to({scaleY:1-pressurePercent}, 500));
			}
		}
		//relay valve
		if (this._isActive.relayValve) {
			if (position == "release" || (position != "emergency" && !onAir)) {
				if (this._relayValveDiapham.scaleX != 1 || this._airRVBP.alpha == 0) {
					tl.addTween(createjs.Tween.get(this._relayValveChargeFlap, {override:true}).to({rotation:60}, 1000, createjs.Ease.sineOut).to({rotation:0}, 1000, createjs.Ease.sineOut));
				}
				tl.addTween(
					createjs.Tween.get(this._relayValveDiapham, {override:true}).to({scaleX:(1 + pressurePercent * 7)}, 2000),
					createjs.Tween.get(this._airRVBP, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
						//createjs.Tween.get(this._airBvic, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
						//createjs.Tween.get(this._airRVtoBV, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
					createjs.Tween.get(this._airRVEQ, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000)
						//createjs.Tween.get(this._airEQ, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
				);
				if (bvicOpen) {
					//tl.addTween(createjs.Tween.get(this._airBVtoBP, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000));
				}
			} else if (onAir && position == "applied" && this._relayValveDiapham.scaleX <= (1 + pressurePercent * 7)) {
				tl.addTween(
					createjs.Tween.get(this._relayValveDiapham, {override:true}).to({scaleX:(1 + pressurePercent * 7)}, 2000),
					createjs.Tween.get(this._airRVBP, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
						//createjs.Tween.get(this._airBvic, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
						//createjs.Tween.get(this._airRVtoBV, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
					createjs.Tween.get(this._airRVEQ, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
						//createjs.Tween.get(this._airEQ, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
					createjs.Tween.get(this._relayValveExhaustFlap, {override:true}).to({rotation:60}, 1000, createjs.Ease.sineOut).to({rotation:0}, 1000, createjs.Ease.sineOut)
					//createjs.Tween.get(this._airCVtoE, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000).to({alpha:0}, 1000)
				);
				if (bvicOpen) {
					//tl.addTween(createjs.Tween.get(this._airBVtoBP, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000));
				}
			} else if (position == "emergency") {
				if (onAir) {
					tl.addTween(
						createjs.Tween.get(this._relayValveDiapham, {override:true}).to({scaleX:8}, 2000),
						createjs.Tween.get(this._airRVEQ, {override:true}).to({alpha:(1-((1*7)/15))}, 1000)
						//createjs.Tween.get(this._airEQ, {override:true}).to({alpha:(1-((1*7)/15))}, 1000)
					);
				}
				if (bvicOpen) {
					tl.addTween(
						createjs.Tween.get(this._airRVBP, {override:true}).wait(500).to({alpha:0}, 1000)
						//createjs.Tween.get(this._airBvic, {override:true}).wait(500).to({alpha:0}, 1000)
						//createjs.Tween.get(this._airRVtoBV, {override:true}).wait(500).to({alpha:0}, 1000)
						//createjs.Tween.get(this._airBVtoBP, {override:true}).wait(500).to({alpha:0}, 1000)
					);
				} else {
					//tl.addTween(createjs.Tween.get(this._airBVtoBP, {override:true}).wait(500).to({alpha:0}, 1000));
				}
			}
		}

		this._previousPressure = pressure;
		this._previousStep = step;
		//animate it
		tl.gotoAndPlay(0);
	};

	//private methods
	p._addEvents = function() {
		//mouse click (activate component)
		this.valveBase.on("click", function(event) {
			//find the component and scale it to center screen
			//also return the existing component
			if (event.target.name == "fullSimulation" || event.target.name == "fullBackground" || this._fullSimulation.selected) {
				return;
			}
			if (this._activeComp.name != "") {
				//reset the active component;
				this._isActive[this._activeComp.name] = false;
				createjs.Tween.get(this._activeComp.component, {override:true}).to({x:this._activeComp.origX, y:this._activeComp.origY, scaleX:1, scaleY:1}, 2000, createjs.Ease.backOut);
			}
			//ignore if active component
			if (this._activeComp.name == event.target.name) {
				this._activeComp.name = "";
			} else { // activate it
				this._activeComp.name = event.target.name;
				switch (this._activeComp.name) {
					case "chargingValve" :
						this._activeComp.component = this._chargingValveBase;
						this._activeComp.origX = this._chargingValveInfo.origX;
						this._activeComp.origY = this._chargingValveInfo.origY;
						break;
					case "bvic" :
						this._activeComp.component = this._bvicBase;
						this._activeComp.origX = this._bvicInfo.origX;
						this._activeComp.origY = this._bvicInfo.origY;
						break;
					case "lomv" :
						this._activeComp.component = this._lomvBase;
						this._activeComp.origX = this._lomvInfo.origX;
						this._activeComp.origY = this._lomvInfo.origY;
						break;
					case "rpValve" :
						this._activeComp.component = this._rpValveBase;
						this._activeComp.origX = this._rpValveInfo.origX;
						this._activeComp.origY = this._rpValveInfo.origY;
						break;
					case "regulatingValve" :
						this._activeComp.component = this._regulatingValveBase;
						this._activeComp.origX = this._regulatingValveInfo.origX;
						this._activeComp.origY = this._regulatingValveInfo.origY;
						break;
					case "relayValve" :
						this._activeComp.component = this._relayValveBase;
						this._activeComp.origX = this._relayValveInfo.origX;
						this._activeComp.origY = this._relayValveInfo.origY;
						break;
				}
				//remove the component label if any
				if (this._compTextBase.children.length > 0) {
					createjs.Tween.get(this._compTextBase).to({alpha:0}, 100).call(function() {
						this._compTextBase.removeAllChildren();
						this.valveBase.removeChild(this._compTextBase);
					}, [], this);
				}
				this._isActive[this._activeComp.name] = true;
				createjs.Tween.get(this._activeComp.component, {override:true}).to({x:(375 - this._activeComp.component.getBounds().width/2), y:70, scaleX:2, scaleY:2}, 2000, createjs.Ease.sineOut);
			}

		}, this);
		//mouse over (pointer and name)
		this.valveBase.on("mouseover", function(event) {
			if (event.target.name == "fullSimulation" || event.target.name == "fullBackground" || event.target.name == "instructions") {
				return;
			}
			if (this._compTextBase.children.length == 0 && event.target.name != this._activeComp.name) {
				var compTxt = new createjs.Text("", "30px Arial", "#FFFFFF");
				var textBack = new createjs.Shape();
				//add text
				switch (event.target.name) {
					case "chargingValve" :
						compTxt.text = this._chargingValveInfo.desc;
						this._compTextBase.x = this._chargingValveBase.x - 40;
						this._compTextBase.y = this._chargingValveBase.y - 40;
						break;
					case "relayValve" :
						compTxt.text = this._relayValveInfo.desc;
						this._compTextBase.x = this._relayValveBase.x;
						this._compTextBase.y = this._relayValveBase.y - 40;
						break;
					case "lomv" :
						compTxt.text = this._lomvInfo.desc;
						this._compTextBase.x = this._lomvBase.x - 50;
						this._compTextBase.y = this._lomvBase.y - 35;
						break;
					case "rpValve" :
						compTxt.text = this._rpValveInfo.desc;
						this._compTextBase.x = this._rpValveBase.x - 250;
						this._compTextBase.y = this._rpValveBase.y - 50;
						break;
					case "bvic" :
						compTxt.text = this._bvicInfo.desc;
						this._compTextBase.x = this._bvicBase.x - 10;
						this._compTextBase.y = this._bvicBase.y - 50;
						break;
					case "regulatingValve" :
						compTxt.text = this._regulatingValveInfo.desc;
						this._compTextBase.x = this._regulatingValveBase.x - 110;
						this._compTextBase.y = this._regulatingValveBase.y - 50;
						break;
				}
				compTxt.x=compTxt.y=5;					
				//add background rectangle
				textBack.graphics.f("black").rr(0,0,compTxt.getBounds().width+10,compTxt.getBounds().height+10,10);
				this._compTextBase.addChild(textBack, compTxt);
				this._compTextBase.alpha=0;
				this.valveBase.addChild(this._compTextBase);
				createjs.Tween.get(this._compTextBase).to({alpha:1}, 500);
			}
		}, this);
		//mouse out (pointer and name)
		this.valveBase.on("rollout", function(event) {
			if (this._compTextBase.children.length > 0 && event.target.name != this._activeComp.name) {
				createjs.Tween.get(this._compTextBase).to({alpha:0}, 0).call(function() {
					this._compTextBase.removeAllChildren();
					this.valveBase.removeChild(this._compTextBase);
				}, [], this);
			}
		}, this);
	};
	
	p._drawIt = function() {
		//charging valve
		this._chargingValve.name = this._chargingValveSlider.name = "chargingValve";
		this._chargingValveSlider.y=20;
		this._chargingValveBase.addChild(this._chargingValve, this._chargingValveSlider);
		this._chargingValveBase.x = this._chargingValveInfo.origX;
		this._chargingValveBase.y = this._chargingValveInfo.origY;
		this._chargingValveBase.cursor = "pointer";
		//bvic
		this._bvic.name = this._bvicSlider.name = "bvic";
		this._bvicSlider.y = 20;
		this._bvicSlider.x = 15;
		this._bvicBase.addChild(this._bvic, this._bvicSlider);
		this._bvicBase.x = this._bvicInfo.origX;
		this._bvicBase.y = this._bvicInfo.origY;
		this._bvicBase.cursor = "pointer";
		//lomv
		this._lomv.name = this._lomvSlider.name = this._lomvBall.name = "lomv";
		this._lomvSlider.y = 5;
		this._lomvSlider.x = 27;
		this._lomvBall.y = 47;
		this._lomvBall.x = 27;
		this._lomvBase.addChild(this._lomv, this._lomvSlider, this._lomvBall);
		this._lomvBase.x = this._lomvInfo.origX;
		this._lomvBase.y = this._lomvInfo.origY;
		this._lomvBase.cursor = "pointer";
		//release prevention valve
		this._rpValve.name = this._airRPOut.name = this._airRPIn.name = this._rpValveSlider.name = "rpValve";
		this._rpValveSlider.x = 13;
		this._rpValveSlider.y = 25;
		this._airRPOut.x = 34.5;
		this._airRPOut.y = 22.5;
		this._airRPIn.x = 2.5;
		this._airRPIn.y = 0;
		this._rpValveBase.addChild(this._rpValve, this._airRPOut, this._airRPIn, this._rpValveSlider);
		this._rpValveBase.x = this._rpValveInfo.origX;
		this._rpValveBase.y = this._rpValveInfo.origY;
		this._rpValveBase.cursor = "pointer";
		//regulating valve;
		this._regulatingValve.name = this._airRegV.name = this._airRegVJ.name = this._regulatingValveSlider.name = this._regulatingValveLevel.name = "regulatingValve";
		this._airRegV.x = 13;
		this._airRegV.y = 58;
		this._airRegVJ.x = -7;
		this._airRegVJ.y = 80;
		this._airRegVJ.alpha = 0;
		this._regulatingValveSlider.x = 10;
		this._regulatingValveSlider.y = 55;
		this._regulatingValveLevel.x = 55;
		this._regulatingValveLevel.y = 56;
		this._regulatingValveLevel.regY=32;
		this._regulatingValveBase.addChild(this._regulatingValve, this._airRegV, this._airRegVJ, this._regulatingValveSlider, this._regulatingValveLevel);
		this._regulatingValveBase.x = this._regulatingValveInfo.origX;
		this._regulatingValveBase.y = this._regulatingValveInfo.origY;
		this._regulatingValveBase.cursor = "pointer";
		//relay valve;
		this._relayValve.name = this._airRVBP.name = this._airRVEQ.name = this._relayValveDiapham.name = this._relayValveChargeFlap.name = this._relayValveExhaustFlap.name = "relayValve";
		this._airRVBP.x = 94;
		this._airRVEQ.x = 23;
		this._relayValveDiapham.x = 92;
		this._relayValveDiapham.regX = 5;
		this._airRVBP.y = this._airRVEQ.y = this._relayValveDiapham.y = 3;
		this._relayValveChargeFlap.x = 162;
		this._relayValveChargeFlap.y = 21;
		this._relayValveChargeFlap.regX = this._relayValveChargeFlap.regY = 2;
		this._relayValveExhaustFlap.x = 162;
		this._relayValveExhaustFlap.y = 111;
		this._relayValveExhaustFlap.regX = 2;
		this._relayValveExhaustFlap.regY = 22;
		this._relayValveBase.addChild(this._relayValve, this._airRVBP, this._airRVEQ, this._relayValveDiapham, this._relayValveChargeFlap, this._relayValveExhaustFlap);
		this._relayValveBase.x = this._relayValveInfo.origX;
		this._relayValveBase.y = this._relayValveInfo.origY;
		this._relayValveBase.cursor = "pointer";
		//add 'em all
		this.valveBase.addChild(this._chargingValveBase, this._bvicBase, this._lomvBase, this._rpValveBase, this._regulatingValveBase, this._relayValveBase);
	};


	//add to namespace
	brakeSimulator.BrakeValve = BrakeValve;

}());
