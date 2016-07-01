general = require("../General");
component = require("../conditionComponents");

init = function(){
	console.log('d1.js loaded');
	general.connectSockets();
	general.test();

	var pageId = 'd1Spd1';
	general.setPageVars(pageId);

	window.addEventListener("keydown", general.checkKeyPressed, false);

	component.createGraphViewer();
	component.addGraph();

	general.countdown( "countdown", 1, 0 );
	
}();


