import {Request, Response} from 'express';
import IService from './../../../framework/server/interfaces/IService';
import IDB from './../../../framework/server/interfaces/IDB';
import Delay from './../../../framework/common/commands/Delay';
import DelayedValue from './../../../framework/common/commands/DelayedValue';
import APICommand from './commands/APICommand';
import DBCommand from './commands/DBCommand';
import invoke from './../../../framework/server/invoke/invoke';
import wrapAsync from './../../../framework/server/express/wrapAsync';

interface APIServiceSettings {
  name: string;
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

  @wrapAsync
  async throwApiError(req: Request, res: Response) {
    throw new Error('Test api error');
  }

  @wrapAsync
  async pinpong(req: Request, res: Response) {
    res.send(req.body);
  }

  async start() {
    // load config, create classes, etc ...
    await(invoke(new Delay(1000)));
    // run processing

    this.settings.webserver.post('/api/data', this.pinpong.bind(this));
    this.settings.webserver.post('/api/throw', this.throwApiError.bind(this));
    this.settings.webserver.use('/', (err, req, res, next) => {
      if (err) {
        res.status(400).json({errors: { general: 'Unexpected api error'}});
        return next(err);
      }

      next();
    })

    this.process();

    console.log(this.settings.name + ' started');
  }

  async process() {
    var counter = this.counter;
    console.log('Start processing: ', counter);
    try {
      this.counter = await (invoke(new APICommand({value: this.counter + 1, timeout: 1000})));
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
        console.log(this.settings.name + ' stopped');
        resolve();
      }, 1000);
    })
  }
}
