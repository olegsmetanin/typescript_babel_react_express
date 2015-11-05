import IHTTPClient, {IHTTPRequest} from '../../common/http/IHTTPClient';
import IEventBus from '../../common/event/IEventBus';

interface IHTTPBufferOptions {
  httpClient : IHTTPClient,
  eventBus   : IEventBus,
}

export default class HTTPBuffer {

  constructor(options: IHTTPBufferOptions) {
    this.options = options;
    const {eventBus} = this.options;
  }

  options: IHTTPBufferOptions;

  eventBus: IEventBus;

  //TODO logic

}
