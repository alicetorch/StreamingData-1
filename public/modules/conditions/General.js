/* This file contains functions that are used by the three diffrent conditions. 
These functions concern functionality*/

console.log('general is loaded')

function validate() {
	experimentr.endTimer(className);
	experimentr.release();
};
function checkKeyPressed(e) {
		if (e.keyCode == "13" || e.keyCode == "32") {
			pressed(e.keyCode, "key");
		}
};

var socket, pageId; 
function setPageVars(pageId){ 
	this.pageId=pageId;
	console.log('pageId are set', this.pageId);
};
	(function(){
		socket = io.connect();
		socket.on('connect',function() {
			console.log('Client has connected to the server!');
		});
			
		document.onmousemove = experimentr.sendMouseMovement;
		experimentr.startTimer(className);
	})();

function countdown( elementName, minutes, seconds ){
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
};


function checkForAnamoly(){
	//console.log(selectedPoints);
	//console.log()
	//allPoints = d3.select(".svg2")[0][0] == null ? d3.select(".line3").datum().concat(d3.select(".line2").datum()).concat(d3.select(".line1").datum()) : selectedPoints;
	//allPoints = d3.select(".line3").datum().concat(d3.select(".line2").datum()).concat(d3.select(".line1").datum());
	//console.log(lines);
	//allPoints = d3.select(".copy1").datum();
	//console.log(allPoints);
	if (d3.select(".svg2")[0][0] == null){
	lines = new getPoints();
	}
	allNoise= d3.select(".svg2")[0][0] == null ? lines.noise : selectedPoints;
	console.log('noise function',allNoise);
	return allNoise.includes("T");
};

function pushBorder()  {
	d3.select(".border")
	.transition()
	.duration(500)
	.attr("rx",70)
	.attr("ry",70)
	.transition()
	.duration(500)
	.attr("rx",20)
	.attr("ry",20);
}

function pressed(buttonTitle, type){
	console.log('button title', buttonTitle);
	//console.log(d3.select(".svg2")[0][0]);
	pushBorder();
	if (d3.select(".svg2")[0][0] != null){
		var linesOnDisplay = d3.selectAll("#lineCopy");
		linesOnDisplay.remove();
		addCopy();
		//addBrush();
		submitButton = d3.select(".submitButton")
			.on("mousedown",feedBack);
	}
	else{
		feedBack(buttonTitle, type);
	}
};
function feedBack(buttonTitle, type){
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

}
function getPoints(){
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
}
function addCopy(){

	lines = new getPoints();
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
};

