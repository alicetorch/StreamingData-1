(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* Contains functions that are used by all experiment modules. This includes recording button events and checking for anamolies.
*@module general 
*@nameSpace generalModule 
*/ 

var socket;



/**
*module representing the pageId 
*@module general
*@global
*@type string
*/

exports.pageId; 

var interactionGroup = [];
var interaction = {}; 
data = {};

module.exports = {
	/** Test to see if the module is loaded
	*@memberof generalModule
	*@function test
	*/
	test : function(){
		console.log("General.js can be used here");
	},
	/** releases next botton and ends timer at the end of the experiment 
	*@memberof generalModule
	*@function validate 
	*/
	validate: function () {
		data.pageId = "Trail";
		data.mouseAction=interactionGroup;
		experimentr.addData(data);
		experimentr.endTimer(exports.pageId);
		experimentr.release();
	},
	/** Adds visual cues that interaction has been detected
	*@memberof generalModule
	*@function pushBorder
	*/
	pushBorder: function(){
		d3.select(".border")
		.transition()
		.duration(500)
		.attr("rx",70)
		.attr("ry",70)
		.transition()
		.duration(500)
		.attr("rx",20)
		.attr("ry",20);
	},
	/** Sends interaction information to backend on button pressed 
	*@memberof generalModule
	*@function pressed
	*@param {string}  buttonTitle
	*@param {string}  type
	*/
	pressed:function(buttonTitle, type){
		general.pushBorder();
		var isPresent = general.checkForAnamoly();
		console.log(exports.pageId);
		timePressed = experimentr.now(exports.pageId);
		timestamp = new Date().getTime();
		var postId = experimentr.postId();

		

		interaction.interactionType = type;
		interaction. buttonTitle = buttonTitle;
		interaction.timePressed = timePressed;
		interaction. postId = postId; 
		interaction.timestamp = timestamp;
		interaction.AnomalyPresent = isPresent;
		interaction.pageId = exports.pageId;
		console.log("interaction", interaction)

		interactionGroup.push(interaction);
		
		//socket.emit('mouseClick',{interactionType: type, buttonTitle: buttonTitle, timePressed: timePressed, postId: postId, timestamp:timestamp, AnomalyPresent: isPresent, pageId:exports.pageId});
	},
	/** 
	*Checks to see if the spacebar or the enter key has been pressed
	*@memberof generalModule
	*@function checkKeyPressed
	*@param {event} e 
	*/
	checkKeyPressed: function(e) {
		if (e.keyCode == "13" || e.keyCode == "32") {
			pressed(e.keyCode, "key");
			console.log('key pressed')
		}
	},
	/** Sets the page ID in this module
	*@memberof generalModule
	*@function setPageVars
	*@param {string} pageId 
	*/
	setPageVars: function(pageId){ 
		exports.pageId=pageId;
		console.log('pageId are set', exports.pageId);
	},
	/** Connects websockets to record user mouse movements
	*@memberof generalModule
	*@function connectSockets
	*/
	connectSockets: function(){
		socket = io.connect();
		socket.on('connect',function() {
			console.log('Client has connected to the server!');
		});
		document.onmousemove = experimentr.sendMouseMovement;
	},
	/** Creates and initializes a countdown clock 
	*@memberof generalModule
	*@function countdown
	*@param {string} elementName
	*@param {integer} minutes 
	*@param {integer} seconds
	*/
	countdown: function( elementName, minutes, seconds ){
		var element, endTime, hours, mins, msLeft;
		
		function twoDigits( n )
		{
			return (n <= 9 ? "0" + n : n);
		}
		
		function updateTimer()
		{
			msLeft = endTime - (+new Date);
			if ( msLeft < 1000 ) {
				element.innerHTML = "countdown's over!";
				Mousetrap.reset();
				// document.onmousemove = experimentr.stopMouseMovementRec;
				general.pressed('next-button', "button");
				// socket.emit('disconnect');
			} else {
				time = new Date( msLeft );
				hours = time.getUTCHours();
				mins = time.getUTCMinutes();
				element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
				setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
			}
		}
		
		element = document.getElementById( elementName );
		endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
		updateTimer();
	},
	/** Selects currently visible data and checks if an anamoly exists
	*@memberof generalModule
	*@function checkForAnamoly
	*@returns {boolean} If anamoly is present boolean is true
	*/
	checkForAnamoly: function(){
		allPoints = d3.select(".line3").datum().concat(d3.select(".line2").datum()).concat(d3.select(".line1").datum());
		allNoise= allPoints.map(function(a) {return a.noise;});
		console.log('noise function',allNoise);
		return allNoise.includes("T");
	}
	
};

},{}],2:[function(require,module,exports){
/**

*@nameSpace ComponentsModule
*/

/**
*These functions set up the diffrent visual components that apply across conditions
*@module conditionComponents
*/


n = 80;
var domain1 = -2.5;
var domain2 = 2.5;
var margin = {top:20, right:20, bottom:20, left:20},
width = 600 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;


x = d3.scale.linear()
.domain([0,n-1])
.range([0,width]);
var y = d3.scale.linear()
.domain([domain1, domain2])
.range([height/3, 0]);

var y2 = d3.scale.linear()
.domain([domain1, domain2])
.range([height*2/3, height/3]);

var y3 = d3.scale.linear()
.domain([domain1, domain2])
.range([height, height*2/3]);

module.exports = {
	/** Creates the buttons for detecting an anamoly and also the axis and container for graphs
	*@memberof ComponentsModule
	*/ 
	createGraphViewer:function(className){
		general.test();

		d3.select("#"+className)
		.append('div')
		.attr('id', 'test-buttons')
		.append("button")
		.text('Anomaly Detected')
		.attr('id', 'button1')
		.attr('name','researchButton')
		.on('click',function(){
			general.pressed(d3.select(this).attr('id') , "button");
			console.log(' research button pressed');
		});


		var svgContainer = d3.select("#"+className).append("svg")
		.attr("width", 1500)
		.attr("height", 500);


		var borderPath = svgContainer.append("rect")
		.attr("class","border")
		.attr("x",40)
		.attr("y",20)
		.attr("width",width)
		.attr("height",height)
		.style("stroke","#A4A4A4")
		.style("fill","none")
		.style("stroke-width",3)
		.attr("rx",20)
		.attr("ry",20);


		var xAxis=d3.svg.axis().scale(x).orient("bottom");

		svg	= svgContainer.append("g")
		.attr("transform", "translate(" +40+ "," + 20 + ")");
		svg.append("g")
		.attr("class","x axis")
		.attr("transform","translate(0," + y(0)+")")
		.call(xAxis);

		svg.append("defs").append("clipPath")
		.attr("id","clip")
		.append("rect")
		.attr("width",width)
		.attr("height",height+500);

		svg.append("defs").append("clipPath")
		.attr("id","clip2")
		.append("rect")
		.attr("transform","translate(0,0)")
		.attr("width",width)
		.attr("height",height+500);

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + y2(0) + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + y3(0) + ")")
		.call(xAxis);



	}, 
	/** Imports data files and adds lines to the graph container 
	*@memberof ComponentsModule
	*/
	addGraph:function (className, dataPath1, dataPath2, dataPath3, duration){
		var q = d3.queue();
		q.defer(d3.tsv, dataPath1)
		q.defer(d3.tsv, dataPath2)
		q.defer(d3.tsv, dataPath3)
		.await(setUp); 


		function setUp(error, data1, data2, data3){
			if (error) throw error;


			var disData1 = data1.slice(0,n);
			var disData2 = data2.slice(0,90);
			var disData3 = data3.slice(0,n);

			var line1  = d3.svg.line()
			.x(function(d,i){return x(i);})
			.y(function(d){ return  y(parseFloat(d.value));})
			.interpolate("basis");

			var line2 = d3.svg.line()
			.x(function(d,i){return x(i);})
			.y(function(d){ return  y2(parseFloat(d.value));})
			.interpolate("basis");

			var line3 = d3.svg.line()
			.x(function(d,i){return x(i);})
			.y(function(d){ return  y3(parseFloat(d.value));})
			.interpolate("basis");

			var path1 =svg.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData1)
			.attr("class","line1")
			.attr("d",line1);

			var path2 = svg.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData2)
			.attr("class","line2")
			.attr("d",line2);

			var path3= svg.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData3)
			.attr("class","line3")
			.attr("d",line3);

			tick();

			function tick(){

				disData1.push(data1.slice(0,1)[0]);
				data1.splice(0,1);

				if(d3.select('#countdown').html() == "countdown's over!"){
					data1=[];
				}

				if(data1.length>=1){
					path1
					.attr("d",line1)
					.attr("transform",null)
					.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					disData1.shift();

					disData2.push(data2.slice(0,1)[0]);
					data2.splice(0,1);
					path2
					.attr("d",line2)
					.attr("transform",null)
					.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					disData2.shift();

					disData3.push(data3.slice(0,1)[0]);;
					data3.splice(0,1);
					path3
					.attr("d",line3)
					.attr("transform",null)
					.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					.each("end",tick);
					disData3.shift();
				}else{
					general.validate();

				}

			};
		};
	}
}

},{}],3:[function(require,module,exports){

/**
*Difficulty One Module. Creates the Difficulty one template. 
*@module d1 
*@requires general
*@requires conditionComponents
*/

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
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})
	}else if(slice == 2){
		d3.json("modules/conditions/d1/spd2/d1Vars2.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})

 	}else{
 		d3.json("modules/conditions/d1/spd3/d1Vars3.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})
	}


	startCondition= function(className, path1, path2, path3, duration){
		console.log(className);
		experimentr.startTimer(className);
		general.setPageVars(className);
		component.createGraphViewer(className);
    	component.addGraph(className, path1, path2, path3,duration);
	};

	general.countdown( "countdown", 1, 0 );
	
}();


},{"../General":1,"../conditionComponents":2}]},{},[3]);
