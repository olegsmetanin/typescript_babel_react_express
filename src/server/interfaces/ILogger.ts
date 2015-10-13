/// <reference path="../../../typings/eventemitter3/eventemitter3.d.ts" />

interface ILogger extends EventEmitter3.EventEmitter {
  log(string: string): void;
}

export default ILogger;
