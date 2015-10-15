/// <reference path="server.d.ts"/>
import Server from './Server';

require('source-map-support').install();

try {
var server = new Server();
server.start();
} catch (e) {
  console.log(e);
}
