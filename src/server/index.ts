import Server from './Server';

var logger = new DefaultLogger(),
  eventbus = new DefaultEventBus(),
  httpclient = new DefaultHTTPClient(),
  dbclient = new DefaultDBClient(),
  system = new System(logger, eventbus, dbclient, httpclient),
  server = new Server(system);

server.start();
