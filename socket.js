var socketio = require('socket.io'),
				expire = 7200;


function initSockets(server, client){
  var io = socketio.listen(server);


    function serverError(err, message){
      console.log(err);
      socket.emit('serverError', {message: message});
    };


};