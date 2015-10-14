import IService from './../../../framework/server/interfaces/IService';
import Delay from './../../../framework/server/commands/Delay';
import DelayedValue from './../../../framework/server/commands/DelayedValue';
import invoke from './../../helpers/invoke';

interface APIServiceSettings {
  name: string;
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
    this.counter = await (invoke(new DelayedValue(this.counter + 1, 1000)));
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
