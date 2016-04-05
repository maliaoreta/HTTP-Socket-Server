var net = require('net');
var fs = require('fs');

var currDate = new Date();
var timestamp = currDate.toUTCString();


var successHeader = 'HTTP/1.1 200 OK\n' + timestamp + '\nServer: MaliaServer';
var failHeader = 'HTTP/1.1  404 NOT FOUND\n' + timestamp + '\nServer: MaliaServer';

var server = net.createServer(function (request) {

  request.on('data', function (data) {
    console.log('Data event has been fired');

    var statusLineUri = '.' + data.toString().split('\n')[0].split(' ')[1];

    fs.readFile(statusLineUri, function (err, data) {

      if (err) {
        request.write(failHeader);
      }
      else {
        request.write(successHeader + '\n\n' + data.toString());
      }
      
      request.end();
    });

  });

  request.on('end', function () {

    console.log('socket ended');
  });
});

server.listen({port : 8080}, function () {

  var address = server.address();
  console.log('Opened server on %d', address.port);
});