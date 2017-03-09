// main js file for simulator.  Requires CreateJS libraries

// constants
const VERSION = 'v2.1.2';
const MAX_REGULATING_VALVE = 550;
const MIN_REGULATING_VALVE = 410;
const EMERGENCY_PRESSURE = 275;
const STEP_PRESSURE = 35;
const BC_GAUGE_X = 600, BC_GAUGE_Y = 110, D_GAUGE_X = 850, D_GAUGE_Y = 110;

// global variables
var stage = new createjs.Stage("canvas");
var previousPressure = 0;
var previousBPPressure = MAX_REGULATING_VALVE;
var eqPressure = MAX_REGULATING_VALVE;
var activeSimulation = null;
var currentSimulation = "gauges";

// constructor
function init() {
	// enable touch interactions if supported on the current device:
	if (createjs.Touch.isSupported) {
		createjs.Touch.enable(stage);
	};
	// update mouse event ticks and track if outside canvas
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;

	// create resize listeners for canvas
	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('orientationchange', resizeCanvas, false);
	resizeCanvas();

	document.getElementById("version").innerHTML = VERSION+"";

	//set up Help Icon
	helpIcon = new brakeSimulator.HelpIcon();

	//set up gauges
	gaugeBrakeCylinder = new brakeSimulator.Gauge(100,"#000000",500);
	gaugeBrakeCylinder.gauge.x = BC_GAUGE_X;
	gaugeBrakeCylinder.gauge.y = BC_GAUGE_Y;
	stage.addChild(gaugeBrakeCylinder.gauge);
	//duplex gauges
	gaugeDual = new brakeSimulator.Gauge(100,"#000000",1100,true);
	gaugeDual.gauge.x = D_GAUGE_X;
	gaugeDual.gauge.y = D_GAUGE_Y;
	stage.addChild(gaugeDual.gauge);
	gaugeDual.setNeedle(750,"red");

	focusGauges();
	currentSimulation = "gauges";
	tripleValve = new brakeSimulator.TripleValve;
	brakeValve = new brakeSimulator.BrakeValve;

	//set up toggle swtich for EP CB
	epCB = new brakeSimulator.ToggleSwitch();
	epCB.switchBase.name = "epCB";
	stage.addChild(epCB.switchBase);

	//set up BVIC
	bvic = new brakeSimulator.BVIC;
	bvic.cockBase.name = "bvic";
	stage.addChild(bvic.cockBase);

	//set up Brake Handle
	brakeHandle = new brakeSimulator.BrakeHandle;
	brakeHandle.handleBase.name = "brakeHandle";
	brakeArrow = new createjs.Shape();
	brakeArrow.graphics.f("#0000CC").mt(100,260).lt(92.5,270).lt(107.5,270).lt(100,260);
	stage.addChild(brakeHandle.handleBase, brakeArrow);

	//assign keyboard event
	document.onkeydown = onkeyPressed;

	//assign mouse events
	stage.addEventListener("clickToggle", onToggleClick);
	stage.addEventListener("moveHandle", onHandleMove);

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
	if (activeSimulation != null) {
		stage.removeChild(activeSimulation);
		activeSimulation = null;
	}
	switch (event.value) {
		case "tripleValve" :
			displayTripleValve();
			break;
		case "brakeValve" :
			displayBrakeValve();
			break;
		case "gauges" :
			focusGauges(true);
	}
	currentSimulation = event.value;
	stage.update();
}

//focus or unfocus Gauges
var focusGauges = function(enlarge) {
	var enlarge = (typeof enlarge !== 'undefined') ?  enlarge : true;
	if (enlarge) {
		createjs.Tween.get(gaugeBrakeCylinder.gauge).to({x:300, y:400, scaleX:1.5, scaleY:1.5}, 1000, createjs.Ease.sineOut);
		createjs.Tween.get(gaugeDual.gauge).to({x:700, y:400, scaleX:1.5, scaleY:1.5}, 1000, createjs.Ease.sineOut);
	} else {
		createjs.Tween.get(gaugeBrakeCylinder.gauge).to({x:BC_GAUGE_X, y:BC_GAUGE_Y, scaleX:1, scaleY:1}, 1000, createjs.Ease.sineOut);
		createjs.Tween.get(gaugeDual.gauge).to({x:D_GAUGE_X, y:D_GAUGE_Y, scaleX:1, scaleY:1}, 1000, createjs.Ease.sineOut);
	}
};

//display triple valve
var displayTripleValve = function() {
	stage.addChild(tripleValve.valveBase);
	activeSimulation = tripleValve.valveBase;
};

//display brake valve
var displayBrakeValve = function() {
	stage.addChild(brakeValve.valveBase);
	activeSimulation = brakeValve.valveBase;
};

//keyboard events
var onkeyPressed = function(keyboardEvent) {
	switch (keyboardEvent.code) {
		case "KeyO" :
			bvic.setToOpen();
			break;
		case "KeyC" :
			bvic.setToClosed();
			break;
		case "KeyE" :
			epCB.toggleIt();
			break;
		case "KeyG" :
			document.getElementById("simulationType").value="gauges";
			document.getElementById("simulationType").onchange();
			break;
		case "KeyT" :
			document.getElementById("simulationType").value="tripleValve";
			document.getElementById("simulationType").onchange();
			break;
		case "KeyB" :
			document.getElementById("simulationType").value="brakeValve";
			document.getElementById("simulationType").onchange();
			break;
	}
	if (keyboardEvent.code.substring(0,5) == "Digit") {
		brakeHandle.stepTo(parseInt(keyboardEvent.code.charAt(5)));
	}
	animateIt();
};

//mouse events
var onToggleClick = function(mouseEvent) {
	if (mouseEvent.target.name == "epCB") {
		animateIt();
	}
};

var onHandleMove = function(mouseEvent) {
	if (mouseEvent.target.name == "bvic"  || mouseEvent.target.name == "brakeHandle") {
		animateIt();
	}
};

//link in handles and switch to gauges
var animateIt = function() {
	brakeHandle.setAir(epCB.switchState());
	setBrakeCylinderGauge();
	setDualGauge();
};

//update the Brake Cylinder Gauge based on the the brake/bvic handle position
var setBrakeCylinderGauge = function() {
	var step = brakeHandle.step();
	var onAir = epCB.switchState();
	var pressure = 0;
	if (onAir) {
		//step range is from 0 to 70 and Emergency of 100
		//adjust brake cylinder between 0 and 275 with regard to brake pipe pressure
		pressure = Math.min((EMERGENCY_PRESSURE / 70) * step, EMERGENCY_PRESSURE);
		if ((bvic.isOpen() || step == 100) && (pressure == 0 || pressure > previousPressure)) {
			gaugeBrakeCylinder.setNeedle(pressure);
			previousPressure = pressure;
		}
	} else {
		if (bvic.isOpen() || step == 10) {
			if (step == 0) {
				pressure = 0;
			} else if (step == 1) {
				pressure = STEP_PRESSURE * 2;
			} else if (step > 1 && step <= 7) {
				pressure = STEP_PRESSURE * step;
			} else {
				pressure = EMERGENCY_PRESSURE;
			}
			gaugeBrakeCylinder.setNeedle(pressure);
		}
	}
};

//update the Dual Gauge based on the brake handle/bvic position
var setDualGauge = function() {
	var step = brakeHandle.step();
	var onAir = epCB.switchState();
	var pressure = 0;
	var position = "";
	if (onAir) {
		//step range is from 0 to 70 and Emergency of 100
		//adjust Brake Pipe between MAX and MIN Regulating value
		pressure = MAX_REGULATING_VALVE - ((MAX_REGULATING_VALVE - MIN_REGULATING_VALVE) / 70) * step;
		if (step == 100) {
			gaugeDual.setNeedle(0);
			eqPressure = MIN_REGULATING_VALVE;
		} else if (bvic.isOpen() && (step > 0 && step < 100) && gaugeDual.getNeedleValue() < MIN_REGULATING_VALVE) {
			gaugeDual.setNeedle(MIN_REGULATING_VALVE);
			previousBPPressure = pressure;
			eqPressure = MIN_REGULATING_VALVE;
		} else if (bvic.isOpen() && (step == 0 || pressure < previousBPPressure)) {
			gaugeDual.setNeedle(pressure);
			previousBPPressure = pressure;
			eqPressure = pressure;
		}
	} else {
		if (step == 10) {
			gaugeDual.setNeedle(0);
		} else if (bvic.isOpen()) {
			if (step == 0) {
				eqPressure = MAX_REGULATING_VALVE;
			}
			gaugeDual.setNeedle(eqPressure);
		}
		pressure = gaugeDual.getNeedleValue();
	}
	if (activeSimulation) {
		switch (activeSimulation) {
			case tripleValve.valveBase :
				if (gaugeDual.getNeedleValue() == 0) {
					tripleValve.slideIt("applied");
				} else if (gaugeDual.getNeedleValue() == MAX_REGULATING_VALVE) {
					tripleValve.slideIt("release");
				} else if (onAir) {
					tripleValve.slideIt("lap", gaugeBrakeCylinder.getNeedleValue() / 275);
				}
				break;
			case brakeValve.valveBase :
				if (step == 0) {
					position = "release";
				} else if ((onAir && step == 100) || (!onAir && step == 10)) {
					position = "emergency";
				} else {
					position = "applied";
				}
				brakeValve.animateIt(position, pressure, step, onAir, bvic.isOpen());
				break;
		}
	}
};

var resizeCanvas = function() {
    var widthToHeight = 1000 / 700;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        document.body.style.height = newHeight + 'px';
        document.body.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        document.body.style.width = newWidth + 'px';
        document.body.style.height = newHeight + 'px';
    }

    document.body.style.marginTop = (-newHeight / 2) + 'px';
    document.body.style.marginLeft = (-newWidth / 2) + 'px';
};
