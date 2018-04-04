// import all dependencies
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const http_port = process.env.PORT || 61813;
const net = require('net');
const input_port = 1337;
const myip = require('quick-local-ip');
const ip4 = myip.getLocalIP4();
const ip6 = myip.getLocalIP6();

console.log(ip4);
console.log(ip6);

// define canvas
var canvas_size_x = 100;
var canvas_size_y = 100;
var canvas_background = 'ffffff';
var canvas_content = [];

// stats counter
var pixel_count = 0;
var pixel_count_flat = 0;
var conn_count = 0;
var conn_count_flat = 0;

// FUNCTIONS
// get color
function get_color(x, y) {
  if (canvas_content[x] != undefined) {
    if (canvas_content[x][y] != undefined) {
      return canvas_content[x][y];
    }
  }
  return canvas_background;
}

// str to color
function str_to_color(color) {
  color = color.trim();
  color = color.toLowerCase();
  if (color.match(/^[a-f0-9]{6}$/i) == color) {
    return color;
  }
  else if (color.match(/^[a-f0-9]{8}$/i) == color) {
    return color.substr(0, 6);
  }
  else {
    return false;
  }
}

// color to HTML color
function color_to_html(color) {
  return '#' + color;
}

// save color to canvas content
function color_to_canvas_content(x, y, color) {
  if (canvas_content[x] == undefined) {
    canvas_content[x] = [];
  }
  canvas_content[x][y] = color;
}

// STATS
function stats() {
  pixel_count_flat = pixel_count;
  pixel_count = 0;
  conn_count_flat = conn_count;
  io.sockets.emit('stats', {pixel: pixel_count_flat, connections: conn_count_flat})

}
setInterval(() => stats(), 1000);

// CONNECTIONS
// define static folder
app.use(express.static(__dirname + '/public'));

// output socket
io.on('connection', function (socket){
  console.log("[HTTP] new connection");
  socket.emit('setting', {
    canvas: {
      size: {
        x: canvas_size_x,
        y: canvas_size_y
      }
    },
    network: {
      ip4: ip4,
      ip6: ip6,
      port: input_port
    }
  });
});

// input socket
var server = net.createServer();

server.on('connection', function (server_socket) {
  console.log(server_socket);
  conn_count++;
  server_socket.setEncoding('utf8');
  console.log('[INPUT] new input');
  server_socket.on('data', function (data) {
    var command = data.split(" ");
    if (command[0] == "PX") {
      var x = parseInt(command[1]);
      var y = parseInt(command[2]);
      if (x <= canvas_size_x && y <= canvas_size_y) {
        if (!isNaN(x) && !isNaN(y)) {
          if (command[3] != undefined) {
            console.log("c is there");
            var color = str_to_color(command[3]);
            console.log(color);
            if (color !== false) {
              console.log("c ok");
              io.sockets.emit('draw', {type: 'pixel', x: x, y: y, color: color_to_html(color)});
              pixel_count++;
              color_to_canvas_content(x, y, color);
            }
            else {
              console.log("c not ok");
            }
          }
          server_socket.write('PX ' + x + ' ' + y + ' ' + get_color(x, y) + '\n');
        }
      }
    }
    else if (command[0] == 'SIZE') {
      server_socket.write('SIZE ' + canvas_size_x + ' ' + canvas_size_x + '\n');
    }
    else if (command[1] == 'STATS') {
      server_socket.write('STATS px:' + pixel_count_flat + ' conn:' + conn_count_flat + '\n');
    }
  });
  server_socket.on('close', function() {
    conn_count--;
  });
});

// start http
http.listen(http_port, () => console.log('[HTTP] port: ' + http_port));

// start input socket
server.listen(input_port, () => console.log('[INPUT] port: ' + input_port));
