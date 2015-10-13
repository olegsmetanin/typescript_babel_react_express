import ISystem from './../interfaces/ISystem';
import ILogger from './../interfaces/ILogger';
import IEventBus from './../interfaces/IEventBus';
import IHTTPClient from './../interfaces/IHTTPClient';
import IDBClient from './../interfaces/IDBClient';

export default class System implements ISystem {
  logger: ILogger;
  eventbus: IEventBus;
  httpclient: IHTTPClient;
  dbclient: IDBClient;

  constructor(logger: ILogger, eventbus: IEventBus, httpclient: IHTTPClient, dbclient: IDBClient) {
    this.logger = logger;
    this.eventbus = eventbus;
    this.httpclient = httpclient;
    this.dbclient = dbclient;
  }
}
