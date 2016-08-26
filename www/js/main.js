// main js file for simulator.  Requires CreateJS libraries

// constants
const VERSION = 'v1.5';
const MAX_REGULATING_VALVE = 550;
const MIN_REGULATING_VALVE = 410;
const EMERGENCY_PRESSURE = 275;
const STEP_PRESSURE = 35;
const SIMULATIONS = [{label:"Gauges",data:"gauges"},
	   {label:"Triple Valve",data:"tripleValve"},
	   {label:"Brake Valve",data:"brakeValve"}];
const BC_GAUGE_X = 600, BC_GAUGE_Y = 150, D_GAUGE_X = 850, D_GAUGE_Y = 150;

// global variables
var stage = new createjs.Stage("canvas");

// constructor
function init() {
	stage.enableMouseOver();

//TODO
//	this.version_txt.text = VERSION;
//	input = new KeyboardInput();
//	addChild(input);

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


	stage.update();

}
