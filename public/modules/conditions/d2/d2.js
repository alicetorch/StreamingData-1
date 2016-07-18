general = require("../General");
component = require("../conditionComponents");

init = function(){
	console.log('d2.js loaded');
	
	window.addEventListener("keydown", general.checkKeyPressed, false);
	var currentPage = d3.select("#module").selectAll("div")[0][1].getAttribute("id");
	var slice = currentPage.slice(-1);
	console.log("slice", slice);

	if(slice == 1){
		d3.json("modules/conditions/d2/spd1/d2Vars1.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})
	}else if(slice == 2){
		d3.json("modules/conditions/d2/spd2/d2Vars2.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})

 	}else{
 		d3.json("modules/conditions/d2/spd3/d2Vars3.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})
	}




	startCondition= function(className, path1, path2, path3, duration){
		console.log('classname in start condition', className);
		experimentr.startTimer(className);
		general.setPageVars(className);
		component.createGraphViewer(className);
		component.creatCopyViewer();
    	component.addGraph(className, path1, path2, path3,duration);
	};

	general.countdown( "countdown", 5, 0 );
	
}();

