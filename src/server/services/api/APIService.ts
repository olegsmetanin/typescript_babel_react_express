import IService from './../../../framework/server/interfaces/IService';
import Delay from './../../../framework/server/commands/Delay';
import DelayedValue from './../../../framework/server/commands/DelayedValue';
import invoke from './../../helpers/invoke';

export default class APIService implements IService {

  counter: number;

  constructor() {
    this.counter = 0;
  }

  async start() {
    // load config, create classes, etc ...
    await(invoke(new Delay(1000)));
    // run processing
    this.process();

    console.log('API Service started');
  }

  async process() {
    this.counter = await (invoke(new DelayedValue(this.counter + 1, 1000)));
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
