import ILogger from './ILogger';
import IEventBus from './IEventBus';
import {IDBClient} from './IDB';
import IHTTPClient from '../../common/http/IHTTPClient';

interface ISystemContext {
  logger: ILogger;
  eventbus: IEventBus;
  dbclient: IDBClient;
  httpclient: IHTTPClient;
}

export default ISystemContext;
