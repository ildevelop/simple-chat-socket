var app = require('express')();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var port =8080;

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'index.html'))
});

app.get('/client.js',function(req,res){
  res.sendFile(path.join(__dirname,'client.js'))
});


server.listen(port,function () {
  console.log("app runing on port:", port);
});
var connections = [];
var namespace = io.of('/room1');

namespace.on('connection', function (socket) {
  connections.push(socket);
  console.log("Online: %s",connections.length);
  var room = '';
  socket.on('btn_click', function (data) {
    if(data.btn ==1){
      console.log("1");
      room = 'demo room 1';
      socket.join(room);
      socket.emit('room_join', {roomname: 1})
      socket.on('send message', function (data) {
        console.log('send message',data);
        namespace.to(room).emit('chat message', data);
      })
    }else if(data.btn ==2){
      console.log("2");
      room = 'demo room 2';
      socket.join(room);
      socket.emit('room_join', {roomname: 2})
      socket.on('send message', function (data) {
        console.log('send message',data);
        namespace.to(room).emit('chat message', data);
      })
    }
  });
  socket.on('disconnect',function (data) {
    connections.splice(connections.indexOf(socket),1)
    console.log("Disconected ", connections.length);
  })

});
