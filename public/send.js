$(function () {
  var socket = io();
  $('form').submit(function(){
    socket.emit('input', $('#m').val());
    $('#m').val('');
    return false;
  });
});
