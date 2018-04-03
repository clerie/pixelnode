const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 61813;

app.use(express.static(__dirname + '/public'));


function onConnection(socket){
  console.log(socket);
  socket.on('input', function(data) {
    console.log(data);
    var command = data.split(" ");
    if (command.lenght() == 4) {
      if (command[0] == "PX") {
        var x = parseInt(command[1]);
        var y = parseInt(command[2]);
        if (!isNaN(x) && !isNaN(y)) {
          var color = command[3]
          socket.broadcast.emit('draw', {type: 'pixel', x: x, y: y, color: color});
        }
      }
    }
  });
}

io.on('connection', onConnection);


http.listen(port, () => console.log('listening on port ' + port));
