/// <reference path="server.d.ts"/>
import Server from './Server';
import Migrator from './migration/index';

var commander = require('commander');
var uuid = require('node-uuid');

require('source-map-support').install();

commander
  .version('0.0.1')
  .option('-c, --config', 'Use config')
  .option('-n, --nodename', 'Node name')
  .option('-m, --migration <action>', 'Migration', /^(init|up)$/i)
  .parse(process.argv);

var config = {};
var nodename = commander.nodename ? commander.nodename : uuid.v4();

//process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV: 'production';

if (commander.config) {
  // Parse config source string
} else {
  //config = require(process.cwd()+'/application.'+process.env.NODE_ENV+'.json');
  //console.log();
  config = require('./../../application.' + process.env.NODE_ENV + '.json');
}
//src/server/index.ts
if (commander.migration == 'init') {
  try {
    var logger = console;
    (new Migrator({config , logger})).init().catch(e => console.log(e));
  } catch (e) {
    console.log(e);
  }
} else {
  try {
    var server = new Server({config, nodename});
    server.start();
  } catch (e) {
    console.log(e);
  }
}
