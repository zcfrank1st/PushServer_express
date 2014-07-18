var gulp = require('gulp');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

gulp.task('start', function () {
  'use strict';
  var start = spawn('node', ['app.js']);
  start.stdout.setEncoding('utf8');
  start.stdout.on('data', function (data) {
    console.log(data);
  });
});


gulp.task('default', ['start'], function () {
  'use strict';
  gulp.watch(['app.js', 'config.js'], function () {
    console.log('server is restarting~');
    exec("lsof -i:3000 | awk 'NR==2 {print $2}'", function (error, stdout) {
      if (error)
        return;
      var pid = stdout.replace(/\s+/g, '');
      console.log('pid: ' + pid);
      exec('kill -9 ' + pid, function (error) {
        if (error)
          return;
        console.log('old process: ' + pid + ' is killed');
        var restart = spawn('node', ['app.js']);
        restart.stdout.setEncoding('utf8');
        restart.stdout.on('data', function (data) {
          console.log(data);
        });
      });
    });
  });
});