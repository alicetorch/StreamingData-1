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
		var brush = d3.svg.brush()
			.x(x)
			.on("brushend",component.brushed);
		
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
			console.log(' research button pressed'+ d3.select(this).attr('id'));
			});
			
		var svgContainer = d3.select("#"+className).append("svg")
			.attr("width", 1500)
			.attr("height", 500);

		var xAxis=d3.svg.axis().scale(x).orient("bottom");

		svg1 = svgContainer.append("g")
			.attr("class","svg1")
			.attr("transform", "translate(" +40+ "," + 20 + ")");
	
		svg1.append("g")
			.attr("class","x axis")
			.attr("transform","translate(0," + y(0)+")")
			.call(xAxis);

		svg1.append("defs").append("clipPath")
			.attr("id","clip")
			.append("rect")
			.attr("width",width)
			.attr("height",height+500);

		svg1.append("defs").append("clipPath")
			.attr("id","clip2")
			.append("rect")
			.attr("transform","translate(0,0)")
			.attr("width",width)
			.attr("height",height+500);

		svg1.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + y2(0) + ")")
			.call(xAxis);

		svg1.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + y3(0) + ")")
			.call(xAxis);

		var borderPath = svg1.append("rect")
			.attr("class","border")
			.attr("x",0)
			.attr("y",0)
			.attr("width",width)
			.attr("height",height)
			.style("stroke","#A4A4A4")
			.style("fill","none")
			.style("stroke-width",3)
			.attr("rx",20)
			.attr("ry",20);
	},
	/** Imports data files and adds lines to the graph container 
	*@memberof ComponentsModule
	*/
	addGraph:function(className, dataPath1, dataPath2, dataPath3, duration){
		var q = d3.queue();
		q.defer(d3.tsv, dataPath1)
		q.defer(d3.tsv, dataPath2)
		q.defer(d3.tsv, dataPath3)
		.await(setUp); 

		function setUp(error, data1, data2, data3){
			if (error) throw error;


			var disData1 = data1.slice(0,n);
			var disData2 = data2.slice(0,n);
			var disData3 = data3.slice(0,n);
			
		 data1.splice(0,n);
		 data2.splice(0,n);
		 data3.splice(0,n);

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

		var path1 =svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData1)
			.attr("class","line1")
			.attr("d",line1);

		var path2 = svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData2)
			.attr("class","line2")
			.attr("d",line2);

		var path3= svg1.append("g")
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
},

createCopyViewer:function(){
	var xAxis=d3.svg.axis().scale(x).orient("bottom");
	
	svg2	= svgContainer.append("g")
	.attr("class","svg2")
	.attr("transform", "translate(" +650+ "," + 20 + ")");
	
	svg2.append("g")
	.attr("class","x axis")
	.attr("transform","translate(0," + y(0)+")")
	.call(xAxis);

	svg2.append("defs").append("clipPath")
	.attr("id","clip")
	.append("rect")
	.attr("width",width)
	.attr("height",height+500);

	svg2.append("defs").append("clipPath")
	.attr("id","clip2")
	.append("rect")
	.attr("transform","translate(0,0)")
	.attr("width",width)
	.attr("height",height+500);

	svg2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + y2(0) + ")")
	.call(xAxis);

	svg2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + y3(0) + ")")
	.call(xAxis);

	var borderPath = svg2.append("rect")
	.attr("class","border")
	.attr("x",0)
	.attr("y",0)
	.attr("width",width)
	.attr("height",height)
	.style("stroke","#A4A4A4")
	.style("fill","none")
	.style("stroke-width",3)
	.attr("rx",20)
	.attr("ry",20);
	
	var submitButton = d3.select("#"+className)
	.append("button")
	.text('submit')
	.attr('class', 'submitButton')
	.attr('name','researchButton');
	
	/*var cancelButton = d3.select("#"+className)
	.append("button")
	.text('cancel')
	.attr('class', 'cancelButton')
	.attr('name','researchButton');
	//console.log(submitButton);*/
},

addBrush:function(){
	svg2.append("g")
		.attr("class","brush")
		.call(brush)
		.selectAll("rect")
		.attr("height",height);
},

brushed:function(){
	var extent = brush.extent();
	var min = Math.round(extent[0]);
	var max = Math.round(extent[1]);
	console.log("min"+ min+ "max" + max);
	if (d3.select(".copy3")[0][0] != null){
		selectedPoints = lines.noise1.slice(min,max).concat(lines.noise2.slice(min,max)).concat(lines.noise3.slice(min,max));
		//console.log(selectedPoints);
	}
	}
};
