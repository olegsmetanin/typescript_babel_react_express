import {Request, Response} from 'express';
import IEventBus from '../../../framework/common/event/IEventBus';
import Delay from './../../../framework/common/commands/Delay';
import DelayedValue from './../../../framework/common/commands/DelayedValue';
import IService from './../../../framework/server/interfaces/IService';
import IDB from './../../../framework/server/database/IDB';
import invoke from './../../../framework/server/invoke/invoke';
import wrapAsync from './../../../framework/server/express/wrapAsync';
import PingEvent from '../../../common/events/PingEvent';
import PongEvent from '../../../common/events/PongEvent';
import APICommand from './commands/APICommand';
import DBCommand from './commands/DBCommand';
import APIRoutes from './APIRoutes';
import ToUserEvent from '../socket/ToUserEvent';


interface APIServiceSettings {
  db: IDB;
  webserver: any;
  eventBus: IEventBus;
}

export default class APIService implements IService {

  counter: number;
  settings: APIServiceSettings;
  timeout: number = -1;

  constructor(settings: APIServiceSettings) {
    this.counter = 0;
    this.settings = settings;
  }

  async start() {
    // load config, create classes, etc ...
    const { webserver, db, eventBus } = this.settings;
    (new APIRoutes({webserver, db})).setup();

    eventBus.on<PingEvent>(PingEvent.type, this.handlePingEvent);

    console.log('APIService started');
  }

  handlePingEvent = (e: PingEvent) => {
    const {user, msg, delay} = e.data;
    const recieved = new Date();
    this.timeout = setTimeout(() => {
      const pongEvent = new PongEvent({msg: `Recieved: ${msg}`, recieved});
      const responseEvent = new ToUserEvent(user, pongEvent);
      this.settings.eventBus.emit(responseEvent);
    }, delay);
  };

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
        clearTimeout(this.timeout);
        console.log('APIService stopped');
        resolve();
      }, 1000);
    })
  }
}
