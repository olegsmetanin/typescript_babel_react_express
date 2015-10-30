/// <reference path="../common.d.ts"/>
import IEvent from './IEvent';
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

  on(event: IEvent, handler: Function) {
    this.em.on(event.name, handler);
    return this;
  }

  off(event: IEvent, handler: Function) {
    this.em.off(event.name, handler);
    return this;
  }

  emit(event: IEvent) {
    return this.em.emit(event.name, event.data);
  }

}

export default EventBus;
