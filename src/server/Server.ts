/// <reference path="server.d.ts"/>
/// <reference path="../../typings/express/express.d.ts"/>

import IService from './../framework/server/interfaces/IService'
import APIService from './services/api/APIService';
import AppService from './services/app/AppService';
import PG from './../framework/server/database/PG';

// NOT WORKING: express is not a function
//import * as express from 'express';

import * as bodyParser from 'body-parser';

interface IServerOptions {
  config: any;
  nodename: string;
}

export default class Server {

  webserver: any;
  appService: IService;
  apiService: IService;
  config: any;
  options: IServerOptions;

  constructor(options: IServerOptions) {
    this.options = options;
    this.config = options.config;

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

    // this.apiService = new APIService({ name: 'API Service', webserver: webserver, db: new PG({ connectionString: 'postgres://postgres:123@localhost/postgres' }) });
    this.apiService = new APIService({
      webserver: webserver,
      db: new PG({ connectionString: this.config.db.main })
    });

    this.appService = new AppService({
      webserver: webserver,
      siteroot: this.config.front.siteroot
    });

    this.webserver = webserver;
  }

  async start() {
  console.log('Start server ' + this.options.nodename);
  await this.apiService.start();
  // at last!
  await this.appService.start();
  // Handle errors
  this.webserver.use('/', (err, req, res, next) => {
    if (err) {
      if (req.is('application/json')) {
        res.status(400).json({errors: { general: 'Unexpected api error'}});
        return next(err);
      }
    }
    next();
  })

  this.webserver.listen(this.config.back.port);
}

async stop() {
  await this.appService.stop();
  await this.apiService.stop();
  //this.webserver.stop();
  console.log('Stop server ' + this.options.nodename);
}
}
