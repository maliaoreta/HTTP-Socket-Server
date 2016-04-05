var net = require('net');
var fs = require('fs');

var currDate = new Date();
var timestamp = currDate.toUTCString();
var successHeader = 'HTTP/1.1 200 OK\n' + timestamp + '\nServer: MaliaServer';
var failHeader = 'HTTP/1.1  404 NOT FOUND\n' + timestamp + '\nServer: MaliaServer';

var server = net.createServer(function (request) {

  request.on('data', function (data) {

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
});

server.listen({port : 8080}, function () {

  var address = server.address();
});