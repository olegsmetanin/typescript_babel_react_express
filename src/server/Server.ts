/// <reference path="server.d.ts"/>
/// <reference path="../../typings/express/express.d.ts"/>

import IService from './../framework/server/interfaces/IService'
import IEventBus from '../framework/common/event/IEventBus';
import EventBus from '../framework/common/event/EventBus';
import APIService from './services/api/APIService';
import AppService from './services/app/AppService';
import AuthService from './services/auth/AuthService';
import SocketIOService from './services/socket/SocketIOService';
import PG from './../framework/server/database/PG';
import PasswordUtils from './../framework/server/password/PasswordUtils';

// NOT WORKING: express is not a function
//import * as express from 'express';

import * as bodyParser from 'body-parser';
import {Request, Response} from 'express';

interface IServerOptions {
  config: any;
  nodename: string;
}

export default class Server {

  webserver: any;
  httpServer: any;

  eventBus: IEventBus;
  authService: IService;
  apiService: IService;
  appService: IService;
  socketService: IService;

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

    this.eventBus = new EventBus({});

    var express = require('express');
    var http = require('http');
    const cookieParser = require('cookie-parser');
    const cookieParserMiddleware = cookieParser(this.config.back.cookieSignature);
    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(cookieParserMiddleware);
    webserver.use(express.static('build/webpublic'));
    webserver.use('/api-doc', express.static('node_modules/swagger-ui/dist'));

    let config = this.config;
    let db = new PG({ connectionString: this.config.db.main });
    const {front: {siteroot}} = this.config;
    const {path:socketPath} = this.config['socket-io'];
    let passwordUtils = new PasswordUtils();

    this.authService = new AuthService({ webserver, config, db, passwordUtils });

    // this.apiService = new APIService({ name: 'API Service', webserver: webserver, db: new PG({ connectionString: 'postgres://postgres:123@localhost/postgres' }) });
    this.apiService = new APIService({ webserver, db, eventBus: this.eventBus });

    this.appService = new AppService({ webserver, siteroot, socketPath });

    const server = http.Server(webserver);
    this.socketService = new SocketIOService({
      eventBus: this.eventBus,
      socketPath,
      server,
      cookieParser: cookieParserMiddleware,
    });

    this.webserver = webserver;
    this.httpServer = server;
  }

  async start() {
  console.log('Start server ' + this.options.nodename);
  try {
    await this.authService.start();
    await this.apiService.start();
    await this.socketService.start();
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

    //this.webserver.listen(this.config.back.port);
    this.httpServer.listen(this.config.back.port);
  } catch (e) {
    console.log(e);
  }
}

async stop() {
  await this.appService.stop();
  await this.socketService.stop();
  await this.apiService.stop();
  await this.authService.stop();
  //this.webserver.stop();
  console.log('Stop server ' + this.options.nodename);
}
}
