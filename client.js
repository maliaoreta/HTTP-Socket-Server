var net = require('net');

var date = new Date();
var timestamp = date.toUTCString();
var url = process.argv[2];
  if (url.includes('http://')) {

    url = url.replace('http://', '');
  }

var host;
  if (url.includes(':')) {

    host = url.slice(0, url.indexOf(':'));
  }
  else if (url.includes('/')) {

    host = url.slice(0, url.indexOf('/'));
  }
  else {
    host = url;
  }

var uri;
  if (url.includes('/')) {

    uri = url.slice(url.indexOf('/'));
  }
  else {
    uri = '/';
  }

var requestHeader = 'GET ' + uri + ' HTTP/1.1\nDate: ' + timestamp + '\nHost: ' + host + '\nUser-Agent: MaliaClient\r\n\r\n';
var port;

if (host.includes('www')) {

  port = 80;
}
else {
  port = 8080;
}

var entireResponse = '';

var client = net.createConnection({port: port, host : host},  function () {

  console.log('connected!');
  
  client.write(requestHeader);

  client.setEncoding('utf8');
  client.on('data', function (data) {

    entireResponse += data;
    client.end();
  });
});


client.on('end', function () {

  entireResponse = entireResponse.split('\n');
  entireResponse.splice(0, entireResponse.indexOf('')+1);
  var msgBody = entireResponse.join('\n');
  process.stdout.write(msgBody);  

  console.log('\ndiconnected');
});