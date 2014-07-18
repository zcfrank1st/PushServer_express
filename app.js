var fs = require('fs');
var redis = require('redis');
var express = require('express');
var morgan = require('morgan');
var config = require('./config.js');

var app = express();

app.use(morgan({
  stream: fs.createWriteStream(config.logger + 'log.txt', {
    flags: 'w'
  })
}));

// 监听路径 channel? X=XXX  准备channel X为 日期 plus UUID
app.get('/channel/:c', function (req, res) {
  'use strict';
  var channel = req.param('c');
  var rclient = redis.createClient(config.rport, config.rhost);
  rclient.subscribe(channel);
  rclient.on('message', function (channel, message) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': true
    });
    res.end(message);
    rclient.unsubscribe();
    rclient.end();
  });
});

app.get('*', function (req, res) {
  'use strict';
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  res.end('Page not found');
});

app.listen(3000, function () {
  'use strict';
  console.log('server is running');
});