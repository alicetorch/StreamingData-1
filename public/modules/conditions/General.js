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
		general.pushBorder();
		var isPresent = general.checkForAnamoly();
		console.log('pressed page id', exports.pageId);
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
