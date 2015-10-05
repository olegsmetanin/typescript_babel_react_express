var webpack = require('webpack');
var config = require('./webpack.server.config.js');
var spawn = require('child_process').spawn;
var compiler = webpack(config);
compiler.watch({
  aggregateTimeout: 300,
  poll: true
}, function(err, stats) {
  if (err) {
    console.log(err)
  } else {
    console.log(stats.toString({
      colors: true
    }))
    if (this.server) {
      this.server.kill('SIGHUP')
    }

    this.server = spawn(process.execPath, [__dirname + '/build/server.js']);
    this.server.stdout.setEncoding('utf8');
    this.server.stdout.on('data', function(data) {
      console.log(data);
    });
    this.server.stderr.setEncoding('utf8');
    this.server.stderr.on('data', function(data) {
      console.log(data);
    });
  }
});
