 
 var socket, pageId; 

 module.exports = {

	validate: function () {
		experimentr.endTimer(className);
		experimentr.release();
	},

	checkKeyPressed: function(e) {
		if (e.keyCode == "13" || e.keyCode == "32") {
			pressed(e.keyCode, "key");
			console.log('key pressed')
		}
	},

	setPageVars: function(pageId){ 
		this.pageId=pageId;
		console.log('pageId are set', this.pageId);
	},
	connectSockets: function(){
		socket = io.connect();
		socket.on('connect',function() {
			console.log('Client has connected to the server!');
		});

		document.onmousemove = experimentr.sendMouseMovement;
		experimentr.startTimer(className);
	},
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
				document.onmousemove = experimentr.stopMouseMovementRec;
				pressed('next-button', "button");
				socket.emit('disconnect');
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
	checkForAnamoly: function(){
		allPoints = d3.select(".line3").datum().concat(d3.select(".line2").datum()).concat(d3.select(".line1").datum());
		allNoise= allPoints.map(function(a) {return a.noise;});
		console.log('noise function',allNoise);
		return allNoise.includes("T");
	},
	pushBorder:function()  {
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
	pressed:function(buttonTitle, type){
		console.log('button title', buttonTitle);
		
		pushBorder();

		var isPresent = checkForAnamoly();
		console.log('is anomolyPresent' + isPresent); 

		var timePressed = experimentr.now(className);
		timestamp = new Date().getTime();
		var postId = experimentr.postId();
		console.log('post id in experiment', postId);
		console.log('this is pageID', pageId);
		socket.emit('mouseClick',{interactionType: type, buttonTitle: buttonTitle, timePressed: timePressed, postId: postId, timestamp:timestamp, AnomalyPresent: isPresent, pageId:pageId});
	}

};
