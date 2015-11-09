import {Request, Response} from 'express';
import IService from './../../../framework/server/interfaces/IService';
import IDB from './../../../framework/server/database/IDB';
import Delay from './../../../framework/common/commands/Delay';
import DelayedValue from './../../../framework/common/commands/DelayedValue';
import APICommand from './commands/APICommand';
import DBCommand from './commands/DBCommand';
import invoke from './../../../framework/server/invoke/invoke';
import wrapAsync from './../../../framework/server/express/wrapAsync';
import APIRoutes from './APIRoutes';


interface APIServiceSettings {
  db: IDB;
  webserver: any;
}

export default class APIService implements IService {

  counter: number;
  settings: APIServiceSettings;

  constructor(settings: APIServiceSettings) {
    this.counter = 0;
    this.settings = settings;
  }

  async start() {
    // load config, create classes, etc ...
    var { webserver, db } = this.settings;
    (new APIRoutes({webserver, db})).setup();
    // run processing
    //this.process();

    console.log('APIService started');
  }

  async process() {
    var counter = this.counter;
    console.log('Start processing: ', counter);
    try {
      this.counter = (await invoke(new APICommand({value: this.counter + 1, timeout: 1000})));
      var q = await invoke(new DBCommand({q: 'select 1 as q', db: this.settings.db}));

      //setTimeout(() => this.process(), 1000);
    } catch(e) {
      console.log(e);
      console.trace();
    }
    console.log('End processing: ', counter);
  }

  async stop() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('APIService stopped');
        resolve();
      }, 1000);
    })
  }
}
