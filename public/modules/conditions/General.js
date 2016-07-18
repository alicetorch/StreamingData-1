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
		experimentr.setPageType(exports.pageId);
		console.log('exports page id' + exports.pageId)
		data.mouseAction = interactionGroup;
		console.log(interactionGroup)
		console.log('data on merge' + data)
		experimentr.merge(data);
		experimentr.endTimer( exports.pageId);
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
	
		var interaction = {}; 
		general.pushBorder();
		
		
		if (d3.select(".svg2")[0][0] != null){
			var linesOnDisplay = d3.selectAll("#lineCopy");
			linesOnDisplay.remove();
			general.addCopy();
			component.addBrush();
			submitButton = d3.select(".submitButton")
			.on("mousedown",general.feedBack);
			}
		else{
			general.feedBack(buttonTitle, type);
		}
		
		var isPresent = general.checkForAnamoly();
		console.log('pressed page id', exports.pageId);
		timePressed = experimentr.now(exports.pageId);
		timestamp = new Date().getTime();
		var postId = experimentr.postId();

		
		console.log("button title", buttonTitle)
		interaction.interactionType = type;
		interaction. buttonTitle = buttonTitle;
		interaction.timePressed = timePressed;
		interaction. postId = postId; 
		interaction.timestamp = timestamp;
		interaction.AnomalyPresent = isPresent;
		interaction.pageId = exports.pageId;
		console.log("interaction", interaction)
		console.log("before push")
		console.log(interactionGroup)
		interactionGroup.push(interaction);
		console.log("after push")
		console.log(interactionGroup)

		//socket.emit('mouseClick',{interactionType: type, buttonTitle: buttonTitle, timePressed: timePressed, f: postId, timestamp:timestamp, AnomalyPresent: isPresent, pageId:exports.pageId});
	},
	/** 
	*Checks to see if the spacebar or the enter key has been pressed
	*@memberof generalModule
	*@function checkKeyPressed
	*@param {event} e 
	*/
	checkKeyPressed: function(e) {
		if (e.keyCode == "13" || e.keyCode == "32") {
			general.pressed(e.keyCode, "key");
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

	if (d3.select(".svg2")[0][0] == null){
	lines = new general.getPoints();
	}
	allNoise= d3.select(".svg2")[0][0] == null ? lines.noise : exports.selectedPoints;
		console.log('selected points from general = '+exports.selectedPoints)
		console.log('noise function',allNoise);
		return allNoise.includes("T");
	console.log('noise function',allNoise);
	return allNoise.includes("T");
},

pushBorder: function()  {
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


feedBack:function(buttonTitle, type){
	var isPresent = checkForAnamoly();
	var linesOnDisplay = d3.selectAll("#lineCopy");
		linesOnDisplay.remove();
	d3.select(".brush").call(brush.clear());
	console.log('is anomolyPresent' + isPresent); 
	var timePressed = experimentr.now(className);
	timestamp = new Date().getTime();
	var postId = experimentr.postId();
		console.log('post id in experiment', postId);
		console.log('this is pageID', pageId);
	socket.emit('mouseClick',{interactionType: type, buttonTitle: buttonTitle, timePressed: timePressed, postId: postId, timestamp:timestamp, AnomalyPresent: isPresent, pageId:pageId});
},


getPoints:function(){
	var line1 = d3.select(".line1").datum().map(function(a) {return [a.value, a.noise];});
	var line2 = d3.select(".line2").datum().map(function(a) {return [a.value, a.noise];});
	var line3 = d3.select(".line3").datum().map(function(a) {return [a.value, a.noise];});
	this.points1 = line1.map(function(a){return a[0]});
	this.points2 = line2.map(function(a){return a[0]});
	this.points3 = line3.map(function(a){return a[0]});
	this.noise = line1.map(function(a){return a[1]}).concat(line2.map(function(a){return a[1]}).concat(line3.map(function(a){return a[1]})));
	this.noise1 = line1.map(function(a){return a[1]});
	this.noise2 = line2.map(function(a){return a[1]});
	this.noise3 = line3.map(function(a){return a[1]});
	//console.log(this.noise);
},
addCopy:function(){

	lines = new general.getPoints();
	points1 = lines.points1;
	points2 = lines.points2;
	points3 = lines.points3;
	var copy1  = d3.svg.line()
		.x(function(d,i){return x(i);})
		.y(function(d){ return  y(parseFloat(d));})
		.interpolate("basis");

	var copy2 = d3.svg.line()
		.x(function(d,i){return x(i);})
		.y(function(d){ return  y2(parseFloat(d));})
		.interpolate("basis");

	var copy3 = d3.svg.line()
		.x(function(d,i){return x(i);})
		.y(function(d){ return  y3(parseFloat(d));})
		.interpolate("basis");

	var copyPath1 =svg2.append("g")
		.attr("clip-path","url(#clip)")
		.append("path")
		.datum(points1)
		.attr("class","line1 copy1")
		.attr("id","lineCopy")
		.attr("d",copy1);
	var copyPath2 = svg2.append("g")
		.attr("clip-path","url(#clip)")
		.append("path")
		.datum(points2)
		.attr("class","line2 copy2")
		.attr("id","lineCopy")
		.attr("d",copy2);

	var copyPath3= svg2.append("g")
		.attr("clip-path","url(#clip)")
		.append("path")
		.datum(points3)
		.attr("class","line3 copy3")
		.attr("id","lineCopy")
		.attr("d",copy3);
	}
};

