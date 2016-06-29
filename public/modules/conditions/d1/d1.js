
init = function(){
	console.log('d1.js loaded');
	var pageId = 'd1Spd1';
	setPageVars(pageId);

	window.addEventListener("keydown", checkKeyPressed, false);

	createGraphViewer();
	addGraph();

	countdown( "countdown", 1, 0 );

}();


