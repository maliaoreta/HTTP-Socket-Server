var net = require('net');
var fs = require('fs');

var currDate = new Date();
var timestamp = currDate.toUTCString();
var successHeader = 'HTTP/1.1 200 OK\n' + timestamp + '\nServer: MaliaServer';
var failHeader = 'HTTP/1.1  404 NOT FOUND\n' + timestamp + '\nServer: MaliaServer';
var header405 = 'HTTP/1.1 405 METHOD NOT ALLOWED\n' + timestamp + '\nServer: MaliaServer';

var server = net.createServer(function (request) {

  request.on('data', function (data) {

    var statusLine = data.toString().split('\n')[0];
    var statusLineUri = '.' + statusLine.split(' ')[1];
    var statusLineMethod = statusLine.split(' ')[0];

    if (statusLineMethod !== 'GET' && statusLineMethod !== 'HEAD') {

      fs.readFile('./405.html', function (err, data) {

        if (err) {
          throw new Error(err);
        }
        else {
          request.write(header405 + '\n\n' + data.toString());
        }

        request.end();
      });
    }
    else {

      if (statusLineUri === './') {
        statusLineUri = './index.html';
      }

      fs.readFile(statusLineUri, function (err, data) {

        if (err) {
          
          return redirectTo404(request);
        }
        else {
          
          request.write(successHeader + '\n\n' + data.toString());
        }

        request.end();
      });
    }
  });
});

server.listen({port : 8080}, function () {

  var address = server.address();
});

function redirectTo404 (request) {

  fs.readFile('./404.html', function (err, data) {

    if (err) {
      throw new Error(err);
    }
    else {
      request.write(failHeader + '\n\n' + data.toString());
    }

    request.end();
  });
};