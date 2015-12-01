/// <reference path="../client.d.ts"/>

import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;
import IEventBus from '../../common/event/IEventBus';
import EBEvent from '../../common/event/EBEvent';
import SigninEvent from '../events/Signin';
import SignoutEvent from '../events/Signout';

declare type EventTypeFactories = {[eventType: string]: <T extends EBEvent>(data: any) => T};

interface ISocketIOBridgeOptions {
  endpoint : string;
  path     : string;
  eventBus : IEventBus;
  map?     : EventTypeFactories;
}

/**
 * Watch socket.io channel and re-emit events into application event bus.
 * Watch application event bus and re-emit events with type 'toServer' to server socket.io service.
 * Watch system events SigninEvent and SignoutEvent in application event bus and connect/disconnect
 * app to/from server socket.io service.
 */
export default class SocketIOBridge {

  endpoint: string;
  path    : string;
  eventBus: IEventBus;
  map     : EventTypeFactories;
  socket  : Socket;

  constructor(options: ISocketIOBridgeOptions) {
    this.endpoint = options.endpoint;
    this.path     = options.path;
    this.eventBus = options.eventBus;
    this.map      = options.map;
  }

  start = () => {
    this.eventBus.on<EBEvent>('toServer', this._emitToServer);
    this.eventBus.on<SigninEvent>(SigninEvent.type, this._reconnect);
    this.eventBus.on<SignoutEvent>(SignoutEvent.type, this._disconnect);

    this._connect(); //try to connect, if user already logged in
  };

  stop = () => {
    this._disconnect();

    this.eventBus.off<SignoutEvent>(SignoutEvent.type, this._disconnect);
    this.eventBus.off<SigninEvent>(SigninEvent.type, this._reconnect);
    this.eventBus.off<EBEvent>('toServer', this._emitToServer);
  };

  _emitToServer = (data: any) => {
    if (this.socket) {
      this.socket.emit('toServer', data);
    }
  }

  _connect = () => {
    const socket = io.connect(this.endpoint, {
      path: this.path,
      forceNew: true,
    });
    socket.on('notify', (msg) => {
      //console.log('catch msg from socket server', msg);

      let evt: EBEvent;
      if (!msg.hasOwnProperty('type') || !this.map || !this.map[msg.type]) {
        const evt = new EBEvent();
        evt.type = 'socket:notify';
      } else {
        evt = this.map[msg.type](msg.data);
      }

      this.eventBus.emit(evt);
    });
    socket.on('error', (err) => {
      console.log('socket io error', err);
    });
    socket.on('disconnect', () => {
      console.log('disconnect event catched');
      this._disconnect();
    });
    this.socket = socket;
  };

  _disconnect = () => {
    const socket: Socket = this.socket;
    if (!socket) {
      return;
    }
    socket.removeAllListeners();
    socket.close();
  };

  _reconnect = () => {
    this._disconnect();
    this._connect();
  };

}
