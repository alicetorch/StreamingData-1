


window.addEventListener("keydown", checkKeyPressed, false);
var copyIndex = 1;
function checkKeyPressed(e) {
	if (e.keyCode == "13" || e.keyCode == "32") {
		e.preventDefault();
		update("A",1);
		update("B",2);
		update("C",3);
		copyIndex = copyIndex + 1;
	}
}
function windowClicked(e) {
	update("A",1);
	update("B",2);
	update("C",3);
	copyIndex = copyIndex + 1;
}
window.addEventListener("click",windowClicked);


function update(d,i){
	var orig = d3.select(".lineClick"+i);
	var origNode = orig.node();
	var copy = d3.select(origNode.parentNode.appendChild(origNode.cloneNode(true),origNode.nextSibling))
	.attr("class","lineCopy"+d+copyIndex)
	.attr("id","lineCopy"+i)
	.style("visibility","visible");
	var string = ".lineCopy"+d+(copyIndex-1);
	var preNode = d3.select(string)
	.remove();	
}	

var n = 30;

var margin = {top:20, right:20, bottom:20, left:20},
	width = 600 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
	.domain([0,n-1])
	.range([0,width]);

var y = d3.scale.linear()
	.domain([-0.5, 0.5])
	.range([height/3, 0]);

var y2 = d3.scale.linear()
	.domain([-0.5, 0.5])
	.range([height*2/3, height/3]);

var y3 = d3.scale.linear()
	.domain([-0.5, 0.5])
	.range([height, height*2/3]);

var xAxis=d3.svg.axis().scale(x).orient("bottom");


// var brush = d3.svg.brush()
//     .x(x)
//     .on("brush", brushed);

var svgClick = d3.select('#'+className).svg.append("g")
.attr("id","svgClick")
.attr("transform", "translate(" +640+ "," + 20 + ")");

svgClick.append("g")
.attr("class","x axis")
.attr("transform","translate(0," + y(0)+")")
.call(xAxis);

svgClick.append("defs").append("clipPath")
.attr("id","clip")
.append("rect")
.attr("width",width)
.attr("height",height+500);


svgClick.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + y2(0) + ")")
.call(xAxis);

svgClick.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + y3(0) + ")")
.call(xAxis);


