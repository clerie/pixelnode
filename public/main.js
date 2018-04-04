'use strict';

(function() {

  var stats = document.getElementsByClassName('stats')[0];
  var play = document.getElementsByClassName('play')[0];

  var socket = io();

  var canvas = document.getElementsByClassName('display')[0];
  var context = canvas.getContext('2d');

  var canvas_size_x = 100;
  var canvas_size_y = 100;

  socket.on('setting', onSetting);
  socket.on('drawn', onDrawn);
  socket.on('draw', onDraw);
  socket.on('stats', onStats);

  window.addEventListener('resize', onResize, false);
  onResize();

  function onSetting(data) {
    canvas_size_x = data.canvas.size.x;
    canvas_size_y = data.canvas.size.y;

    var out = 'Play PixelFlut @ ';

    if (data.network.ip4 != '') {
      out += 'IP4 ' + data.network.ip4 + ' ';
    }
    if (data.network.ip4 != '' && data.network.ip6 != '') {
      out += '|| ';
    }
    if (data.network.ip6 != '') {
      out += 'IP6 ' + data.network.ip6 + ' ';
    }
    out += 'port ' + data.network.port;
    play.innerHTML = out;
  }


  function drawLine(x0, y0, x1, y1, color){
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
  }

  function drawPixel(x, y, color){
    context.fillStyle = '#' + color;
    context.fillRect(x - (canvas.width * (0.5/canvas_size_x)),y - (canvas.height * (0.5/canvas_size_y)), canvas.width * (1/canvas_size_x), canvas.height * (1/canvas_size_y));
  }

  function onDraw(data){
    var w = canvas.width;
    var h = canvas.height;
    if (data.type == 'pixel') {
      drawPixel((data.x / canvas_size_x) * w, (data.y / canvas_size_y) * h, data.color);
    }
  }

  function onDrawn(data){
    console.log(data);
    var w = canvas.width;
    var h = canvas.height;
    data.forEach(function (d, x){
      if (d !== null) {
        d.forEach(function (c, y) {
          if (c !== null) {
            drawPixel((x / canvas_size_x) * w, (y / canvas_size_y) * h, c);
          }
        });
      }
    });
  }

  function onStats(data) {
    stats.innerHTML = 'px/s: ' + data.pixel + ' connections: ' + data.connections;
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

})();
