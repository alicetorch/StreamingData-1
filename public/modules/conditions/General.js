/**
* Contains functions that are used by all experiment modules. This includes recording button events and checking for anamolies.
* @exports general 
*/ 

var socket;

/**
*module representing the pageId 
*@module general
*@type string
*/

exports.pageId; 

var data = {};
 

module.exports = {
	/** Test to see if the module is loaded
	*@memberof general
	*/
	test : function(){
		console.log("General.js can be used here");
	},
	/** releases next botton and ends timer at the end of the experiment 
	*@memberof general
	*/
	validate: function () {
		experimentr.endTimer(exports.pageId);
		experimentr.release();
	},
	/** Adds visual cues that interaction has been detected
	*@memberof general
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
	*@memberof general
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
		

		data["interactionType"] = type;
		data["buttonTitle"] = buttonTitle;
		data["timePressed"] = timePressed;
		data["postId"] = postId; 
		data["timestamp"] = timestamp;
		data["AnomalyPresent"] = isPresent;
		data["pageId"] = exports.pageId;
		experimentr.addData(data);
		console.log(data);
		
		//socket.emit('mouseClick',{interactionType: type, buttonTitle: buttonTitle, timePressed: timePressed, postId: postId, timestamp:timestamp, AnomalyPresent: isPresent, pageId:exports.pageId});
	},
	/** 
	*Checks to see if the spacebar or the enter key has been pressed
	*@memberof general
	*@param {event} e 
	*/
	checkKeyPressed: function(e) {
		if (e.keyCode == "13" || e.keyCode == "32") {
			pressed(e.keyCode, "key");
			console.log('key pressed')
		}
	},
	/** Sets the page ID in this module
	*@memberof general
	*@param {string} pageId 
	*/
	setPageVars: function(pageId){ 
		exports.pageId=pageId;
		console.log('pageId are set', exports.pageId);
	},
	/** Connects websockets to record user mouse movements
	*@memberof general
	*/
	connectSockets: function(){
		socket = io.connect();
		socket.on('connect',function() {
			console.log('Client has connected to the server!');
		});
		document.onmousemove = experimentr.sendMouseMovement;
	},
	/** Creates and initializes a countdown clock 
	*@memberof general
	*@param {string} elementName
	*@param {integer} minutes 
	*@param {integer} seconds
	*/
	countdown: function( elementName, minutes, seconds ){
		var element, endTime, hours, mins, msLeft, time;
		
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
	*@memberof general
	*@returns {boolean} If anamoly is present boolean is true
	*/
	checkForAnamoly: function(){
		allPoints = d3.select(".line3").datum().concat(d3.select(".line2").datum()).concat(d3.select(".line1").datum());
		allNoise= allPoints.map(function(a) {return a.noise;});
		console.log('noise function',allNoise);
		return allNoise.includes("T");
	}
	
};
