var io = require('socket.io')(1337);
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
io.pingTimeout=0;

var count =0;

io.on('connection', function(socket){
  count++;
  console.log(count + ':' + socket.id);
  socket.on('disconnect', function(){
    count--;
    console.log(count);
  });
  socket.on('message', function(){

  })
});

