import IService from './../../../framework/server/interfaces/IService';
import IDB from './../../../framework/server/interfaces/IDB';
import Delay from './../../../framework/server/commands/Delay';
import DelayedValue from './../../../framework/server/commands/DelayedValue';
import APICommand from './commands/APICommand';
import DBCommand from './commands/DBCommand';
import invoke from './../../helpers/invoke';
var wrap = fn => (...args) => fn(...args).catch(args[2]);

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

  async start() {
    // load config, create classes, etc ...
    await(invoke(new Delay(1000)));
    // run processing

    this.settings.webserver.post('/api/data', wrap(async (req, res) => {
      res.send(req.body);
    }));


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
