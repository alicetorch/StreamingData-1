general = require("../General");
component = require("../conditionComponents");

init = function(){
	console.log('d1.js loaded');
	//general.connectSockets();

	window.addEventListener("keydown", general.checkKeyPressed, false);
	var currentPage = d3.select("#module").selectAll("div")[0][1].getAttribute("id");
	var slice = currentPage.slice(-1);
	console.log("slice", slice);

	if(slice == 1){
		d3.json("modules/conditions/d1/spd1/d1Vars1.json", function(error, data){
			console.log(data.vars.className);
			experimentr.startTimer(data.vars.className);
			general.setPageVars(data.vars.className);
			component.createGraphViewer(data.vars.className);
	    	component.addGraph(data.vars.duration,data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3);
		})
	}else if(slice == 2){
		d3.json("modules/conditions/d1/spd2/d1Vars2.json", function(error, data){
			console.log(data.vars.className);
			experimentr.startTimer(data.vars.className);
			general.setPageVars(data.vars.className);
			component.createGraphViewer(data.vars.className);
	    	component.addGraph(data.vars.duration,data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3);
		})

 	}else{
 			d3.json("modules/conditions/d1/spd3/d1Vars3.json", function(error, data){
			console.log(data.vars.className);
			experimentr.startTimer(data.vars.className);
			general.setPageVars(data.vars.className);
			component.createGraphViewer(data.vars.className);
	    	component.addGraph(data.vars.duration,data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3);
		})
	}

	general.countdown( "countdown", 5, 0 );
	
}();

