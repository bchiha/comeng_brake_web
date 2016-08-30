// main js file for simulator.  Requires CreateJS libraries

// constants
const VERSION = 'v2.0';
const MAX_REGULATING_VALVE = 550;
const MIN_REGULATING_VALVE = 410;
const EMERGENCY_PRESSURE = 275;
const STEP_PRESSURE = 35;
const SIMULATIONS = [{label:"Gauges",data:"gauges"},
	   {label:"Triple Valve",data:"tripleValve"},
	   {label:"Brake Valve",data:"brakeValve"}];
const BC_GAUGE_X = 600, BC_GAUGE_Y = 110, D_GAUGE_X = 850, D_GAUGE_Y = 110;

// global variables
var stage = new createjs.Stage("canvas");

// constructor
function init() {
	stage.enableMouseOver();

	document.getElementById("version").innerHTML = VERSION+"";

//TODO
//	input = new KeyboardInput();
//	addChild(input);

	//set up Help Icon
	helpIcon = new HelpIcon();

	//set up gauges
	gaugeBrakeCylinder = new Gauge(100,"#000000",500);
	gaugeBrakeCylinder.setX(BC_GAUGE_X);
	gaugeBrakeCylinder.setY(BC_GAUGE_Y);
	stage.addChild(gaugeBrakeCylinder.gauge);
	//duplex gauges
	gaugeDual = new Gauge(100,"#000000",1100,true);
	gaugeDual.setX(D_GAUGE_X);
	gaugeDual.setY(D_GAUGE_Y);
	stage.addChild(gaugeDual.gauge);

	focusGauges();
	currentSimulation = "gauges";



	//animation heartbeat
	createjs.Ticker.addEventListener("tick", onTick);

};

//update animation each tick
var onTick = function(e) {
	stage.update(e);
};

//select simulation type
var onSimulationType = function(event) {
	if (currentSimulation == "gauges") {
		focusGauges(false);
	}
//	if (activeSimulation != null) {
//		removeChild(activeSimulation);
//				activeSimulation = null;
//			}
//			switch (event.value) {
//				case "tripleValve" :
//					addTripleValve();
//					break;
//				case "brakeValve" :
//					addBrakeValve();
//					break;
//				case "gauges" :
//					focusGauges(true);
//			}
//			currentSimulation = event.value;
//			stage.focus = null;
}

//focus or unfocus Gauges
var focusGauges = function(enlarge = true) {
	if (enlarge) {
		createjs.Tween.get(gaugeBrakeCylinder.gauge).to({x:300, y:400, scaleX:1.5, scaleY:1.5}, 1000, createjs.Ease.sineOut);
		createjs.Tween.get(gaugeDual.gauge).to({x:700, y:400, scaleX:1.5, scaleY:1.5}, 1000, createjs.Ease.sineOut);
	} else {
		createjs.Tween.get(gaugeBrakeCylinder.gauge).to({x:BC_GAUGE_X, y:BC_GAUGE_Y, scaleX:1, scaleY:1}, 1000, createjs.Ease.sineOut);
		createjs.Tween.get(gaugeDual.gauge).to({x:D_GAUGE_X, y:D_GAUGE_Y, scaleX:1, scaleY:1}, 1000, createjs.Ease.sineOut);
	}
};
