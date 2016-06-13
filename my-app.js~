/* global require:true, console:true, process:true, __dirname:true */
'use strict'

// Example run command: `node app.js 9000 6380 true`; listen on port 9000, connect to redis on 6380, debug printing on.

var express     = require('express')
, http        = require('http')
, redis       = require('redis')
, io          = require('socket.io')
, mturk       = require('mturk-api')
,fs           = require('fs')
, redisClient
, port        = process.argv[2] || 4000
, rport       = process.argv[3] || 6379
, debug       = process.argv[4] || null
, socketPort  = process.argv[5] || 80

// Database setup
redisClient = redis.createClient(rport)
redisClient.on('connect', function() {
  console.log('Connected to redis.')
})



// var fileName = '../config.js'
// var config;

// try {
//   config = require(fileName);
//   console.log(config.keys.awsAccess);
// }
// catch (err) {
//   config = {}
//   console.log("unable to read file '" + fileName + "': ", err)
//   console.log("see secret-config-sample.json for an example")
 
// }



var Mturkconfig = {
  access: 'AKIAIWJG2VZR3FCBG2DA', 
  secret: 'H2yQbZ+QCCas+/v7gyhkmJDWnWwB0+Yi6pXnsfhO',
  sandbox: true 
};


 
var api = mturk.createClient(Mturkconfig);

// api.req('GetAccountBalance').then(function(response){
//   console.log(response)
// }, function(error){
//   //Handle error 
//});

debugger;

var _questionString = '<ExternalQuestion xmlns = "http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd"> <ExternalURL>"http://ec2-54-172-19-199.compute-1.amazonaws.com/"</ExternalURL><FrameHeight>400</FrameHeight></ExternalQuestion>'

var _HITOption = {
      Title: "why is this not working. "
    , Keywords: "photo"
    , Description: "Say Yes or No to the question."
    , Reward: {Amount: '0.01', CurrencyCode: 'USD', FormattedPrice: '$0.01'}
    , AssignmentDurationInSeconds: 180 // in 3 minutes 
    , AutoApprovalDelayInSeconds: 28800 // auto approve the worker's anwser and pay to him/her 
    , MaxAssignments: 100 // 100 worker 
    , QualificationRequirement: [
        {
            QualificationTypeId: '000000000000000000L0', // HIT Approval Rate % 
            Comparator: 'GreaterThan',
            IntegerValue: [60],
            RequiredToPreview: true
        },
        {
            QualificationTypeId: '000000000000000000S0', // HIT Reject Rate % 
            Comparator: 'LessThan',
            IntegerValue: [10],
            RequiredToPreview: true
        },
        {
            QualificationTypeId: '00000000000000000060', // Adult Content Qualification 
            Comparator: 'EqualTo',
            IntegerValue: [1],
            RequiredToPreview: true
        }]
    , Question: _questionString
    , LifetimeInSeconds: 86400 * 3 // 3 days 
};


api.req('CreateHIT', _HITOption).then(function(response){
  debugger;
  console.log(response)
}, function(error){
  debugger;
  console.log(error)
});



//Creating a hit that links to hostedWebApo



var mouseAction = [];
var mouseLocation = [];

// Data handling
var save = function save(d) {
   // console.log(d)
  Client.hmset("key", d.postId, d)

  if( debug )
    console.log('saved to redis: ' + d.postId +', at: '+ (new Date()).toString())
}

// Server setup
var app = express()
app.use(express.bodyParser())
app.use(express.static(__dirname + '/public'))
app.use('/scripts', express.static(__dirname + '/node_modules/'));

// If the study has finished, write the data to file
app.post('/finish', function(req, res) {
  fs.readFile('public/modules/blocked-workers.json', 'utf8', function(err,data) {
    if (err) console.log(err);
    var data = JSON.parse(data);
    data.push(req.body.workerId);
    data = JSON.stringify(data);
    fs.writeFile('public/modules/blocked-workers.json', data, function(err) {
      if(err) console.log(err);
    });
  });

  res.send(200)
})

// handle posts  from front front end for mouse movement and mouse action information
function handleCollectedDataPost(postId){
  // console.log('nuggets in redis')

  var sendInBulk = {mouseLocation, mouseAction}
   console.log(sendInBulk)

  //sendInBulk = JSON.stringify(JSON.stringify(sendInBulk))
  sendInBulk = {'postId': postId, 'data':sendInBulk}
  save(sendInBulk)

  mouseLocation = [];
  mouseAction =[];
}

// Handle POSTs from frontend
app.post('/', function handlePost(req, res) {
  // Get experiment data from request body
  var d = req.body
  // If a postId doesn't exist, add one (it's random, based on date)
  if (!d.postId) d.postId = (+new Date()).toString(36)
  // Add a timestamp
d.timestamp = (new Date()).getTime()
  // Save the data to our database
  save(d)

  // Send a 'success' response to the frontend
  res.send(200)
})


// Create the server and tell which port to listen to
var server = http.createServer(app).listen(port, function (err) {
  if (!err) console.log('Listening on port ' + port)
})

server.listen(socketPort)

io.listen(server).on('connection', function (socket) {
  socket.on('mouseMove', function (msg) {
    mouseLocation.push({'timestamp': msg.timestamp, 'X': msg.mouseX, 'Y': msg.mouseY})
    // console.log('mouse movement Received: '+ msg.mouseX+ ' , ' + msg.mouseY);
  });

  socket.on('disconnect', function(){
    console.log('disconnected');
  })

  socket.on('mouseClick', function(msg){
    console.log('mouseCLICKED!!!'+ msg.buttonTitle);
    if(msg.buttonTitle=='next-button'){
      // console.log('mouse clicked and stuff is being sent away!! ')
      handleCollectedDataPost(msg.postId, msg.timestamp);
    }else{
      mouseAction.push({'timestamp': msg.timePressed, 'buttonTitle':msg.buttonTitle })
      // console.log('click event: ' + msg.buttonTitle + msg.timePressed);
    }
  }); 
})

