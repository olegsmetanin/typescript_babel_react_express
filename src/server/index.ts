/// <reference path="server.d.ts"/>
import Server from './Server';

var commander = require('commander');
var uuid = require('node-uuid');

require('source-map-support').install();

commander
  .version('0.0.1')
  .option('-c, --config', 'Use config')
  .option('-n, --nodename', 'Node name')
  .parse(process.argv);

var config = {};
var nodename = commander.nodename ? commander.nodename : uuid.v4();

if (commander.config) {
  // Parse config source string
} else {
  config = require(process.cwd()+'/application.'+process.env.NODE_ENV+'.json');
}

try {
  var server = new Server({config, nodename});
  server.start();
} catch (e) {
  console.log(e);
}
