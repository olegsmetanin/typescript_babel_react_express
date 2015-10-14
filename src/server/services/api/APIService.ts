import IService from './../../../framework/server/interfaces/IService';
import IDB from './../../../framework/server/interfaces/IDB';
import Delay from './../../../framework/server/commands/Delay';
import DelayedValue from './../../../framework/server/commands/DelayedValue';
import APICommand from './commands/APICommand';
import DBCommand from './commands/DBCommand';
import invoke from './../../helpers/invoke';


interface APIServiceSettings {
  name: string;
  db: IDB;
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
    this.process();

    console.log(this.settings.name + ' started');
  }

  async process() {
    this.counter = await (invoke(new APICommand({value: this.counter + 1, timeout: 1000})));
    var q = await invoke(new DBCommand({db: this.settings.db}));
    console.log('q', q);
    console.log('Processing: ', this.counter);
    setTimeout(() => this.process(), 1000);
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
