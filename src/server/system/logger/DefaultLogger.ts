/// <reference path="../../../typings/eventemitter3/eventemitter3.d.ts" />

import ILogger from './../interfaces/ILogger';
//import EventEmitter from 'eventemitter3';

export default class Logger extends EventEmitter3.EventEmitter implements ILogger {
  log(string: string): void {
    console.log(string);
  }
}
