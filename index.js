var redis = require('socket.io-redis'),
  mongoose = require('mongoose'),
  models = require('./model/models'),
  server = require('socket.io')(80);

server.adapter(redis({ host: 'localhost', port: 6379 }));

var user = new models.User({
  username:'yining3',
  password:'k593dfpz',
  email:'xstar@qq.com'
});
user.save(function(err){
  if(err){
    return console.log(err.msg);
  }

  models.User.auth('yining3','k593dfpz', function(err, user, reason){
    if(err){
      return console.log(err.msg);
    }
    if(user){
      return console.log('Login success');
    }
    console.log(reason);
  });
});

mongoose.connect('mongodb://localhost/socket_server');
//io.engine.pingTimeout=30000000;
var count = 0;
server.on('connection', function(socket){
  count++;
  console.log('Client Connected:'+count);
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    count--;
    console.log('Client Disconnected:'+count);
  });
});





//var http = require('http').Server(app);

//
//var redis = require('socket.io-redis');
//io.adapter(redis({ host: 'localhost', port: 6379 }));
//
//app.get('/', function(req, res){
//  res.send("hiya");
//});
//
//io.on('connection', function(socket){
//  console.log('a user connected');
//});
//
//http.listen(1337, function(err){
//  if (err){
//    console.log(err.message);
//    return;
//  }
//  console.log('listening on *:1337');
//});



//io.engine.pingTimeout=300000;
//


//console.log('Socket server is listening on port' + io.port);