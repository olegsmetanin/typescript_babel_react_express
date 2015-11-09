import {Request, Response} from 'express';
import IService from './../../../framework/server/interfaces/IService';
import IDB from './../../../framework/server/database/IDB';
import AuthRoutes from './AuthRoutes';
import PasswordUtils from './../../../framework/server/password/PasswordUtils';

interface AuthServiceSettings {
  config: any;
  db: IDB;
  webserver: any;
  passwordUtils: PasswordUtils;
}

export default class AuthService implements IService {

  settings: AuthServiceSettings;

  constructor(settings: AuthServiceSettings) {
    this.settings = settings;
  }

  async start() {
    // load config, create classes, etc ...
    var { webserver, config, db, passwordUtils } = this.settings;
    (new AuthRoutes({webserver, config, db, passwordUtils})).setup();

    console.log('AuthService started');
  }

  async stop() {
    console.log('AuthService stopped');
  }
}
