/// <reference path="../common.d.ts"/>
import EBEvent from './EBEvent';
import IEventBus from './IEventBus';

//import {EventEmitter} from 'eventemitter3';
var EventEmitter = require('eventemitter3');


interface IEventBusOptions {
}

class EventBus implements IEventBus {

  em: any;

  constructor(options: IEventBusOptions) {
    this.em = new EventEmitter();
  }

  on<T extends EBEvent>(type: string, handler: (T) => void) {
    this.em.on(type, handler);
    return this;
  }

  off<T extends EBEvent>(type: string, handler: (T) => void) {
    this.em.off(type, handler);
    return this;
  }

  emit<T extends EBEvent>(event: T) {
    return this.em.emit(event.type, event);
  }

}

export default EventBus;
