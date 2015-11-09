/// <reference path="server.d.ts"/>
/// <reference path="../../typings/express/express.d.ts"/>

import IService from './../framework/server/interfaces/IService'
import APIService from './services/api/APIService';
import AppService from './services/app/AppService';
import AuthService from './services/auth/AuthService';
import PG from './../framework/server/database/PG';
import PasswordUtils from './../framework/server/password/PasswordUtils';

// NOT WORKING: express is not a function
//import * as express from 'express';

import * as bodyParser from 'body-parser';
import {Request, Response} from "express";

interface IServerOptions {
  config: any;
  nodename: string;
}

export default class Server {

  webserver: any;

  authService: IService;
  apiService: IService;
  appService: IService;

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
    const cookieParser = require('cookie-parser');
    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(cookieParser(this.config.back.cookieSignature));
    webserver.use(express.static('build/webpublic'));

    let config = this.config;
    let db = new PG({ connectionString: this.config.db.main });
    let siteroot = this.config.front.siteroot;
    let passwordUtils = new PasswordUtils();

    this.authService = new AuthService({ webserver, config, db, passwordUtils });

    // this.apiService = new APIService({ name: 'API Service', webserver: webserver, db: new PG({ connectionString: 'postgres://postgres:123@localhost/postgres' }) });
    this.apiService = new APIService({ webserver, db });

    this.appService = new AppService({ webserver, siteroot });

    this.webserver = webserver;
  }

  async start() {
  console.log('Start server ' + this.options.nodename);
  try {
    await this.authService.start();
    await this.apiService.start();
    // at last!
    await this.appService.start();

    // Handle errors
    this.webserver.use('/', (err, req: Request, res: Response, next) => {
      if (err) {
        if (req.is('application/json')) {
          res.status(400).json({ errors: { general: 'Unexpected api error' } });
        }
        return next(err);
      }
      next();
    });

    this.webserver.listen(this.config.back.port);
  } catch (e) {
    console.log(e);
  }
}

async stop() {
  await this.appService.stop();
  await this.apiService.stop();
  await this.authService.stop();
  //this.webserver.stop();
  console.log('Stop server ' + this.options.nodename);
}
}
