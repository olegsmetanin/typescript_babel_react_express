import ISystem from './../../interfaces/ISystem';
import IService from './../../interfaces/IService';

import Delay from './../../commands/Delay';
import DelayedValue from './../../commands/DelayedValue';

export default class APIService implements IService {

  logger: ILogger;

  counter: number;

  constructor(system: ISystem) {
    this.counter = 0;
    this.system = system;
  }

  async start() {
    // load config, create classes, etc ...
    await(new Delay(1000).execute());
    // run processing
    this.process();

    console.log('API Service started');
  }

  async process() {
    this.counter = await (new DelayedValue(this.counter + 1, 1000).execute());
    console.log('Processing: ', this.counter);
    setTimeout(() => this.process(), 1000);
  }

  async stop() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('API Service stopped');
        resolve();
      }, 1000);
    })
  }
}
