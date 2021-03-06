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
		this._chargingValveText = new createjs.Text();
		this._bvicBase = new createjs.Container();
		this._bvic = new createjs.Bitmap("img/bv/bviCock.png");
		this._bvicSlider = new createjs.Bitmap("img/bv/bviCockSlider.png");
		this._bvicText = new createjs.Text();
		this._lomvBase = new createjs.Container();
		this._lomv = new createjs.Bitmap("img/bv/lomv.png");
		this._lomvSlider = new createjs.Bitmap("img/bv/lomvSlider.png");
		this._lomvBall = new createjs.Bitmap("img/bv/lomvBall.png");
		this._lomvText = new createjs.Text();
		this._rpValveBase = new createjs.Container();
		this._rpValve = new createjs.Bitmap("img/bv/releasePreventionValve.png");
		this._rpValveSlider = new createjs.Bitmap("img/bv/releasePreventionValveSlider.png");
		this._airRPOut = new createjs.Bitmap("img/bv/airReleasePreventionOut.png");
		this._airRPIn = new createjs.Bitmap("img/bv/airReleasePreventionIn.png");
		this._rpValveText = new createjs.Text();
		this._regulatingValveBase = new createjs.Container();
		this._regulatingValve = new createjs.Bitmap("img/bv/regulatingValve.png");
		this._regulatingValveSlider = new createjs.Bitmap("img/bv/regulatingValveSlider.png");
		this._regulatingValveLevel = new createjs.Bitmap("img/bv/regulatingValveLevel.png");
		this._airRegV = new createjs.Bitmap("img/bv/airRegulatingValve.png");
		this._airRegVJ = new createjs.Bitmap("img/bv/airRegulatingValveJ.png");
		this._regulatingValveText = new createjs.Text();
		this._relayValveBase = new createjs.Container();
		this._relayValve = new createjs.Bitmap("img/bv/relayValve.png");
		this._relayValveDiapham = new createjs.Bitmap("img/bv/relayValveDiapham.png");
		this._relayValveChargeFlap = new createjs.Bitmap("img/bv/relayValveChargeFlap.png");
		this._relayValveExhaustFlap = new createjs.Bitmap("img/bv/relayValveExhaustFlap.png");
		this._airRVBP = new createjs.Bitmap("img/bv/airRelayValveBp.png");
		this._airRVEQ = new createjs.Bitmap("img/bv/airRelayValveEq.png");
		this._relayValveText = new createjs.Text();
		//full simulation stuff
		this._fullBackgroundBase = new createjs.Container();
		this._fullBackground = new createjs.Bitmap("img/bv/fullBackground.png");
		this._airLomv = new createjs.Bitmap("img/bv/airLomv.png");
		this._airCVtoE = new createjs.Bitmap("img/bv/airCVtoE.png");
		this._airBvic = new createjs.Bitmap("img/bv/airBviCock.png");
		this._airCVOpen = new createjs.Bitmap("img/bv/airChargingValveOpen.png");
		this._airCVClosed = new createjs.Bitmap("img/bv/airChargingValveClosed.png");
		this._airRPtoRV = new createjs.Bitmap("img/bv/airRPtoRV.png");
		this._airCVtoRV = new createjs.Bitmap("img/bv/airCVtoRV.png");
		this._airRVtoBV = new createjs.Bitmap("img/bv/airRVtoBV.png");
		this._airBVtoBP = new createjs.Bitmap("img/bv/airBVtoBP.png");
		this._airRVtoLM = new createjs.Bitmap("img/bv/airRVtoLM.png");
		this._airEQ = new createjs.Bitmap("img/bv/airEQ.png");
		//other stuff
		this._fullSimulationBtn = new createjs.Sprite();
		this._fullsimulationHelper = null
		this._instructions = new createjs.Text();

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
		var simulatedPressure = 1;
		//charging valve
		if (this._isActive.chargingValve) {
			if (position == "emergency") {
				tl.addTween(
					createjs.Tween.get(this._chargingValveSlider, {override:true}).to({x:30}, 500),
					createjs.Tween.get(this._airCVOpen, {override:true}).to({alpha:0}, 0),
					createjs.Tween.get(this._airCVtoRV, {override:true}).to({alpha:0}, 0),
					createjs.Tween.get(this._airCVtoE, {override:true}).wait(500).to({alpha:1}, 1000).to({alpha:0}, 1000),
					createjs.Tween.get(this._airCVClosed, {override:true}).wait(500).to({alpha:1}, 1000).to({alpha:0}, 1000)
				);
			} else {
				tl.addTween(
					createjs.Tween.get(this._chargingValveSlider, {override:true}).to({x:0}, 500),
					createjs.Tween.get(this._airCVOpen, {override:true}).to({alpha:1}, 500),
					createjs.Tween.get(this._airCVtoRV, {override:true}).wait(500).to({alpha:1}, 500)
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
			} else {
				tl.addTween(
					createjs.Tween.get(this._lomvSlider, {override:true}).to({y:5}, 500)
				);
				if (this._lomvBall.y == 72 || position == "release") {
					tl.addTween(createjs.Tween.get(this._lomvBall, {override:true}).to({y:47}, 500).to({x:32}, 1000).to({x:27}, 500));
				}
			}
		}
		//release prevention valve
		if (this._isActive.rpValve) {
			if (position == "release") {
				tl.addTween(
					createjs.Tween.get(this._rpValveSlider, {override:true}).to({x:13}, 500),
					createjs.Tween.get(this._airRPOut, {override:true}).to({alpha:1}, 500),
					createjs.Tween.get(this._airRPtoRV, {override:true}).to({alpha:1}, 500)
				);
			} else {
				tl.addTween(
					createjs.Tween.get(this._rpValveSlider, {override:true}).to({x:24}, 500),
					createjs.Tween.get(this._airRPOut, {override:true}).wait(500).to({alpha:0}, 500),
					createjs.Tween.get(this._airRPtoRV, {override:true}).wait(500).to({alpha:0}, 500)
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
						createjs.Tween.get(this._airRVtoLM, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
						createjs.Tween.get(this._airRegVJ, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000).to({alpha:0}, 1000)
					);
				} else {
					tl.addTween(
						createjs.Tween.get(this._airRegV, {override:true}).to({alpha:(1-(step/15))}, 1000),
						createjs.Tween.get(this._airRVtoLM, {override:true}).to({alpha:(1-(step/15))}, 1000),
						createjs.Tween.get(this._airRegVJ, {override:true}).to({alpha:(1-(step/15))}, 1000).to({alpha:0}, 1000)
					);
				}
			}
			if (position == "release") {
				tl.addTween(
					createjs.Tween.get(this._airRegV, {override:true}).to({alpha:1}, 1000),
					createjs.Tween.get(this._airRVtoLM, {override:true}).to({alpha:1}, 1000)
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
					createjs.Tween.get(this._airBvic, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
					createjs.Tween.get(this._airRVtoBV, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
					createjs.Tween.get(this._airRVEQ, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
					createjs.Tween.get(this._airLomv, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000),
					createjs.Tween.get(this._airEQ, {override:true}).to({alpha:(1-((pressurePercent*7)/15))}, 1000)
				);
				if (bvicOpen) {
					tl.addTween(createjs.Tween.get(this._airBVtoBP, {override:true}).wait(500).to({alpha:(1-((pressurePercent*7)/15))}, 1000));
				}
			} else if (onAir && position == "applied" && (this._relayValveDiapham.scaleX <= (1 + pressurePercent * 7)) || (this._airRVtoBV.alpha==0)) {
				if (this._airRVtoBV.alpha==0) {
					simulatedPressure = 1;
				} else {
					simulatedPressure = pressurePercent;
				}
				tl.addTween(
					createjs.Tween.get(this._relayValveDiapham, {override:true}).to({scaleX:(1 + simulatedPressure * 7)}, 2000),
					createjs.Tween.get(this._airRVBP, {override:true}).wait(500).to({alpha:(1-((simulatedPressure*7)/15))}, 1000),
					createjs.Tween.get(this._airBvic, {override:true}).wait(500).to({alpha:(1-((simulatedPressure*7)/15))}, 1000),
					createjs.Tween.get(this._airRVtoBV, {override:true}).wait(500).to({alpha:(1-((simulatedPressure*7)/15))}, 1000),
					createjs.Tween.get(this._airRVEQ, {override:true}).to({alpha:(1-((simulatedPressure*7)/15))}, 1000),
					createjs.Tween.get(this._airLomv, {override:true}).to({alpha:(1-((simulatedPressure*7)/15))}, 1000),
					createjs.Tween.get(this._airEQ, {override:true}).to({alpha:(1-((simulatedPressure*7)/15))}, 1000),
					createjs.Tween.get(this._relayValveExhaustFlap, {override:true}).to({rotation:60}, 1000, createjs.Ease.sineOut).to({rotation:0}, 1000, createjs.Ease.sineOut),
					createjs.Tween.get(this._airCVtoE, {override:true}).to({alpha:(1-((simulatedPressure*7)/15))}, 1000).to({alpha:0}, 1000)
				);
				if (bvicOpen) {
					tl.addTween(createjs.Tween.get(this._airBVtoBP, {override:true}).wait(500).to({alpha:(1-((simulatedPressure*7)/15))}, 1000));
				}
			} else if (position == "emergency") {
				if (onAir) {
					tl.addTween(
						createjs.Tween.get(this._relayValveDiapham, {override:true}).to({scaleX:8}, 2000),
						createjs.Tween.get(this._airRVEQ, {override:true}).to({alpha:(1-((1*7)/15))}, 1000),
						createjs.Tween.get(this._airLomv, {override:true}).to({alpha:(1-((1*7)/15))}, 1000),
						createjs.Tween.get(this._airEQ, {override:true}).to({alpha:(1-((1*7)/15))}, 1000)
					);
				}
				if (bvicOpen) {
					tl.addTween(
						createjs.Tween.get(this._airRVBP, {override:true}).wait(500).to({alpha:0}, 1000),
						createjs.Tween.get(this._airBvic, {override:true}).wait(500).to({alpha:0}, 1000),
						createjs.Tween.get(this._airRVtoBV, {override:true}).wait(500).to({alpha:0}, 1000),
						createjs.Tween.get(this._airBVtoBP, {override:true}).wait(500).to({alpha:0}, 1000)
					);
				} else {
					tl.addTween(createjs.Tween.get(this._airBVtoBP, {override:true}).wait(500).to({alpha:0}, 1000));
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
			if (this._fullSimulationBtn.currentAnimation == "ss" || event.target.name == "fullBackground" || event.target.name == "instructions" || event.target.name == null) {
				return;
			}
			if (event.target.name == "fullSimulation") {
				this._onFullSimulationClick(event);
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
				//activate the component
				this._isActive[this._activeComp.name] = true;
				createjs.Tween.get(this._activeComp.component, {override:true}).to({x:(375 - this._activeComp.component.getBounds().width/2), y:70, scaleX:2, scaleY:2}, 2000, createjs.Ease.sineOut);
			}

		}, this);
	};
	
	//simulator all components together loading extra air and background
	p._onFullSimulationClick = function(event) {
		var newState = this._fullSimulationBtn.currentAnimation.substr(0,2) == "fs" ? "ss" : "fs";
		var tl = new createjs.Timeline([], null, {paused:true});
		//update helper
		this._fullsimulationHelper.overLabel = newState + "h";
		this._fullsimulationHelper.outLabel = newState;
		this._fullSimulationBtn.gotoAndStop(newState + "h");
		//deactivate active component if any and set all to active
		for (var comp in this._isActive) {
			if (newState == "ss" && this._isActive[comp] == true) {
				//reset the active component
				this._isActive[this._activeComp.name] = false;
				createjs.Tween.get(this._activeComp.component, {override:true}).to({x:this._activeComp.origX, y:this._activeComp.origY, scaleX:1, scaleY:1}, 1000, createjs.Ease.sineOut);
			}
			//make all active or deactive
			this._isActive[comp] = newState == "ss" ? true : false;
		}
		//either full simulation or separate simulation
		if (newState == "ss") {
			tl.addTween(
				createjs.Tween.get(this._rpValveBase).to({x:71.5,y:55}, 2000, createjs.Ease.sineOut),
				createjs.Tween.get(this._regulatingValveBase).to({x:67,y:145}, 2000, createjs.Ease.sineOut),
				createjs.Tween.get(this._lomvBase).to({x:211,y:155}, 2000, createjs.Ease.sineOut),
				createjs.Tween.get(this._relayValveBase).to({x:463,y:145}, 2000, createjs.Ease.sineOut),
				createjs.Tween.get(this._chargingValveBase).to({x:679,y:50}, 2000, createjs.Ease.sineOut),
				createjs.Tween.get(this._bvicBase).to({x:734,y:241}, 2000, createjs.Ease.sineOut),
				createjs.Tween.get(this._rpValveText).to({alpha:0}, 2000),
				createjs.Tween.get(this._regulatingValveText).to({alpha:0}, 2000),
				createjs.Tween.get(this._lomvText).to({alpha:0}, 2000),
				createjs.Tween.get(this._relayValveText).to({alpha:0}, 2000),
				createjs.Tween.get(this._chargingValveText).to({alpha:0}, 2000),
				createjs.Tween.get(this._bvicText).to({alpha:0}, 2000)
			);
			//component air
			this._airLomv.name = "lomv";
			this._airLomv.x = 26;
			this._airLomv.y = 53;
			this._lomvBase.addChildAt(this._airLomv,1);
			this._airCVtoE.alpha = 0;
			this._airCVtoE.x = -52;
			this._airCVtoE.y = 52;
			this._chargingValveBase.addChild(this._airCVtoE);
			this._airBvic.name = "bvic";
			this._airBvic.x = 20;
			this._airBvic.y = 19;
			this._airBvic.scaleY = 1.1;
			this._bvicBase.addChildAt(this._airBvic,1);
			this._airCVOpen.name = this._airCVClosed.name = "chargingValve";
			this._airCVOpen.x = 38;
			this._airCVOpen.y = 20;
			this._chargingValveBase.addChildAt(this._airCVOpen,1);
			this._airCVClosed.alpha = 0;
			this._airCVClosed.x = 68;
			this._airCVClosed.y = 20;
			this._chargingValveBase.addChildAt(this._airCVClosed,2);
			//pipe air;
			this._airRPtoRV.x = 99;
			this._airRPtoRV.y = 87;
			this._airCVtoRV.x = 597;
			this._airCVtoRV.y = 71;
			this._airRVtoBV.x = 592;
			this._airRVtoBV.y = 178;
			this._airBVtoBP.x = 727;
			this._airBVtoBP.y = 41;
			this._airBVtoBP.alpha = 0;
			this._airRVtoLM.x = 154
			this._airRVtoLM.y = 178;
			this._airEQ.x = 242;
			this._airEQ.y = 140;
			this._fullBackground.name = "fullBackground";
			this._fullBackgroundBase.addChild(this._fullBackground, this._airRPtoRV, this._airCVtoRV, this._airRVtoBV, this._airBVtoBP, this._airRVtoLM, this._airEQ);
			//add em all
			this.valveBase.addChild(this._fullBackgroundBase);
			tl.addTween(
				createjs.Tween.get(this._fullBackgroundBase).to({x:30,y:30,alpha:1,scaleX:1,scaleY:1}, 2000, createjs.Ease.sineOut),
				createjs.Tween.get(this._instructions).to({alpha:0}, 2000)
			);
		} else {
			tl.addTween(
				createjs.Tween.get(this._rpValveBase).to({x:this._rpValveInfo.origX,y:this._rpValveInfo.origY}, 2000, createjs.Ease.backOut),
				createjs.Tween.get(this._regulatingValveBase).to({x:this._regulatingValveInfo.origX,y:this._regulatingValveInfo.origY}, 2000, createjs.Ease.backOut),
				createjs.Tween.get(this._lomvBase).to({x:this._lomvInfo.origX,y:this._lomvInfo.origY}, 2000, createjs.Ease.backOut),
				createjs.Tween.get(this._relayValveBase).to({x:this._relayValveInfo.origX,y:this._relayValveInfo.origY}, 2000, createjs.Ease.backOut),
				createjs.Tween.get(this._chargingValveBase).to({x:this._chargingValveInfo.origX,y:this._chargingValveInfo.origY}, 2000, createjs.Ease.backOut),
				createjs.Tween.get(this._bvicBase).to({x:this._bvicInfo.origX,y:this._bvicInfo.origY}, 2000, createjs.Ease.backOut),
				createjs.Tween.get(this._rpValveText).to({alpha:1}, 2000),
				createjs.Tween.get(this._regulatingValveText).to({alpha:1}, 2000),
				createjs.Tween.get(this._lomvText).to({alpha:1}, 2000),
				createjs.Tween.get(this._relayValveText).to({alpha:1}, 2000),
				createjs.Tween.get(this._chargingValveText).to({alpha:1}, 2000),
				createjs.Tween.get(this._bvicText).to({alpha:1}, 2000),
				createjs.Tween.get(this._fullBackgroundBase).to({alpha:0,scaleX:2,scaleY:2}, 2000, createjs.Ease.sineOut).call(function() {
					this.valveBase.removeChild(this._fullBackgroundBase);
				}, [], this),
				createjs.Tween.get(this._instructions).to({alpha:1}, 2000)
			);
			//remove erronious air
			this._chargingValveBase.removeChild(this._airCVtoE);
			this._lomvBase.removeChild(this._airLomv);
			this._bvicBase.removeChild(this._airBvic);
			this._chargingValveBase.removeChild(this._airCVOpen);
			this._chargingValveBase.removeChild(this._airCVClosed);
		}
		//animate it
		tl.gotoAndPlay(0);
	};

	p._drawIt = function() {
		//charging valve
		this._chargingValve.name = this._chargingValveSlider.name = this._chargingValveText.name = "chargingValve";
		this._chargingValveSlider.y=20;
		this._chargingValveText.constructor(this._chargingValveInfo.desc, "16px Arial", "#000000");
		this._chargingValveText.x = this._chargingValveBase.x;
		this._chargingValveText.y = this._chargingValveBase.y+80;
		this._chargingValveBase.addChild(this._chargingValve, this._chargingValveSlider, this._chargingValveText);
		this._chargingValveBase.x = this._chargingValveInfo.origX;
		this._chargingValveBase.y = this._chargingValveInfo.origY;
		this._chargingValveBase.cursor = "pointer";
		//bvic
		this._bvic.name = this._bvicSlider.name = this._bvicText.name = "bvic";
		this._bvicSlider.y = 20;
		this._bvicSlider.x = 15;
		this._bvicText.constructor(this._bvicInfo.desc, "14px Arial", "#000000");
		this._bvicText.x = this._bvicBase.x+30;
		this._bvicText.y = this._bvicBase.y+90;
		this._bvicBase.addChild(this._bvic, this._bvicSlider, this._bvicText);
		this._bvicBase.x = this._bvicInfo.origX;
		this._bvicBase.y = this._bvicInfo.origY;
		this._bvicBase.cursor = "pointer";
		//lomv
		this._lomv.name = this._lomvSlider.name = this._lomvBall.name = this._lomvText.name = "lomv";
		this._lomvSlider.y = 5;
		this._lomvSlider.x = 27;
		this._lomvBall.y = 47;
		this._lomvBall.x = 27;
		this._lomvText.constructor(this._lomvInfo.desc, "16px Arial", "#000000");
		this._lomvText.x = this._lomvBase.x;
		this._lomvText.y = this._lomvBase.y+120;
		this._lomvBase.addChild(this._lomv, this._lomvSlider, this._lomvBall, this._lomvText);
		this._lomvBase.x = this._lomvInfo.origX;
		this._lomvBase.y = this._lomvInfo.origY;
		this._lomvBase.cursor = "pointer";
		//release prevention valve
		this._rpValve.name = this._airRPOut.name = this._airRPIn.name = this._rpValveSlider.name = this._rpValveText.name = "rpValve";
		this._rpValveSlider.x = 13;
		this._rpValveSlider.y = 25;
		this._airRPOut.x = 34.5;
		this._airRPOut.y = 22.5;
		this._airRPIn.x = 2.5;
		this._airRPIn.y = 0;
		this._rpValveText.constructor(this._rpValveInfo.desc, "16px Arial", "#000000");
		this._rpValveText.x = this._rpValveBase.x-10;
		this._rpValveText.y = this._rpValveBase.y+70;
		this._rpValveBase.addChild(this._rpValve, this._airRPOut, this._airRPIn, this._rpValveSlider, this._rpValveText);
		this._rpValveBase.x = this._rpValveInfo.origX;
		this._rpValveBase.y = this._rpValveInfo.origY;
		this._rpValveBase.cursor = "pointer";
		//regulating valve;
		this._regulatingValve.name = this._airRegV.name = this._airRegVJ.name = this._regulatingValveSlider.name = this._regulatingValveLevel.name = this._regulatingValveText.name = "regulatingValve";
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
		this._regulatingValveText.constructor(this._regulatingValveInfo.desc, "16px Arial", "#000000");
		this._regulatingValveText.x = this._regulatingValveBase.x;
		this._regulatingValveText.y = this._regulatingValveBase.y+110;
		this._regulatingValveBase.addChild(this._regulatingValve, this._airRegV, this._airRegVJ, this._regulatingValveSlider, this._regulatingValveLevel, this._regulatingValveText);
		this._regulatingValveBase.x = this._regulatingValveInfo.origX;
		this._regulatingValveBase.y = this._regulatingValveInfo.origY;
		this._regulatingValveBase.cursor = "pointer";
		//relay valve;
		this._relayValve.name = this._airRVBP.name = this._airRVEQ.name = this._relayValveDiapham.name = this._relayValveChargeFlap.name = this._relayValveExhaustFlap.name = this._relayValveText.name = "relayValve";
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
		this._relayValveText.constructor(this._relayValveInfo.desc, "16px Arial", "#000000");
		this._relayValveText.x = this._relayValveBase.x+50;
		this._relayValveText.y = this._relayValveBase.y+140;
		this._relayValveBase.addChild(this._relayValve, this._airRVBP, this._airRVEQ, this._relayValveDiapham, this._relayValveChargeFlap, this._relayValveExhaustFlap, this._relayValveText);
		this._relayValveBase.x = this._relayValveInfo.origX;
		this._relayValveBase.y = this._relayValveInfo.origY;
		this._relayValveBase.cursor = "pointer";
		//full simulation button
		var data = {
			images: ["img/bv/simulationSprite.png"],
			frames: {width:210, height:43},
			animations: {fs:0, fsh:1, ss:2, ssh:3}
		};
	    var spriteSheet = new createjs.SpriteSheet(data);
		this._fullSimulationBtn.constructor(spriteSheet, "fs");
		this._fullSimulationBtn.name = "fullSimulation";
		this._fullSimulationBtn.x = 350;
		this._fullSimulationBtn.y = -30;
		this._fullSimulationBtn.cursor = "pointer";
		this._fullsimulationHelper = new createjs.ButtonHelper(this._fullSimulationBtn, "fs", "fsh");
		//help text
		this._instructions.constructor("Click on valve to activate", "30px Arial", "#000000");
		this._instructions.name = "instructions";
		this._instructions.x = 285;
		this._instructions.y = 385;
		//add 'em all
		this.valveBase.addChild(this._chargingValveBase, this._bvicBase, this._lomvBase, this._rpValveBase, this._regulatingValveBase, this._relayValveBase, this._fullSimulationBtn, this._instructions);
	};


	//add to namespace
	brakeSimulator.BrakeValve = BrakeValve;

}());
