init = function(){
	console.log('d2.js loaded');
	var pageId = 'd2Spd1';
	setPageVars(pageId);

	window.addEventListener("keydown", checkKeyPressed, false);

	createGraphViewer();
	createCopyViewer();
	addGraph();
	addBrush();

countdown( "countdown", 5, 0 );

}();

