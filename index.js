// import all dependencies
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const http_port = process.env.PORT || 61813;
const net = require('net');
const input_port = 1337;

// define canvas
var canvas_size_x = 100;
var canvas_size_y = 100;

// define static folder
app.use(express.static(__dirname + '/public'));

// output socket
io.on('connection', function (socket){
  console.log("[HTTP] new connection");
  socket.emit('setting', {canvas: {size: {x: canvas_size_x, y: canvas_size_y}}});
});

// input socket
var server = net.createServer();

server.on('connection', function (server_socket) {
  server_socket.setEncoding('utf8');
  console.log('[INPUT] new input');
  server_socket.on('data', function (data) {
    var command = data.split(" ");
    if (command.length == 4) {
      if (command[0] == "PX") {
        var x = parseInt(command[1]);
        var y = parseInt(command[2]);
        if (!isNaN(x) && !isNaN(y)) {
          var color = command[3]
          io.sockets.emit('draw', {type: 'pixel', x: x, y: y, color: color});
        }
      }
    }
  });
});

// start http
http.listen(http_port, () => console.log('[HTTP] port: ' + http_port));

// start input socket
server.listen(input_port, () => console.log('[INPUT] port: ' + input_port));
