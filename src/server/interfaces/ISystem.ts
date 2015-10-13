interface ISystem {
  logger: ILogger;
  eventbus: IEventbus;
  httpclient: IHTTPClient;
  dbclient: IDBClient;
}

export default ISystem;
