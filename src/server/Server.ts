/// <reference path="server.d.ts"/>
/// <reference path="../../typings/express/express.d.ts"/>

import IService from './../framework/server/interfaces/IService'
import APIService from './services/api/APIService';
import AppService from './services/app/AppService';
import PG from './../framework/server/database/PG';

// NOT WORKING: express is not a function
//import * as express from 'express';

import * as bodyParser from 'body-parser';

export default class Server {

  webserver: any;
  appService: IService;
  apiService: IService;

  constructor() {
    // var raml = require('raml-parser');
    // raml.loadFile(__dirname +'/publicAPI.raml').then( function(data) {
    //   console.log('RAML: ', data);
    // }, function(error) {
    //   console.log('Error parsing: ' + error);
    // });

    var express = require('express');
    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(express.static('build/webpublic'));

    //this.apiService = new APIService({ name: 'API Service', webserver: webserver, db: new PG({ connectionString: 'postgres://postgres:123@localhost/postgres' }) });
    this.apiService = new APIService({ name: 'API Service', webserver: webserver, db: new PG({ connectionString: 'postgres://postgres:mysecretpassword@192.168.99.100/postgres' }) });

    this.appService = new AppService({ name: 'App Service', webserver: webserver });


    this.webserver = webserver;
  }

async start() {
  console.log('Start server');
  await this.apiService.start();
  // at last!
  await this.appService.start();
  this.webserver.listen(3000);
}

async stop() {
  await this.appService.stop();
  await this.apiService.stop();
  //this.webserver.stop();
  console.log('Stop server');
}
}
