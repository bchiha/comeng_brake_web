// namespace:
this.brakeSimulator = this.brakeSimulator||{};

brakeSimulator.extend = function(subclass, superclass) {
	"use strict";
 
	function o() { this.constructor = subclass; }
	o.prototype = superclass.prototype;
	return (subclass.prototype = new o());
};