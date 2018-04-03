'use strict';

(function() {

  var socket = io();
  var canvas = document.getElementsByClassName('display')[0];
  var context = canvas.getContext('2d');

  socket.on('draw', onDraw);

  window.addEventListener('resize', onResize, false);
  onResize();


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
    context.fillRect(x - (canvas.width * 0.005),y - (canvas.height * 0.005), canvas.width * 0.01, canvas.height * 0.01);
  }

  function onDraw(data){
    var w = canvas.width;
    var h = canvas.height;
    if (data.type == 'pixel') {
      drawPixel(data.x * w, data.y * h, data.color);
    }
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

})();
