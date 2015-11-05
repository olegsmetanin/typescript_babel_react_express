import IHTTPClient, {IHTTPRequest} from '../../common/http/IHTTPClient';
import IEventBus from '../../common/event/IEventBus';
import {FailedToConnectEvent} from '../../common/events/Events';

require('whatwg-fetch');
var fetch = window['fetch'];

interface IHTTPClientSettings {
  eventBus: IEventBus;
}

class HTTPClient implements IHTTPClient {

  settings: IHTTPClientSettings;

  constructor(settings: IHTTPClientSettings) {
    this.settings = settings;
  }

  send(request: IHTTPRequest) {
    return new Promise((resolve, reject) => {
      fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.data)
      }).then(response => {
        if (response.ok) {
          response.json().then(json => resolve(json));
        } else {
          if (response.status === 400) {
            response.json().then(json => reject(json));
          } else {
            //FIXME custom error shape with response or extracted info?
            reject(response);
          }
        }
      }, (e) => {
        reject(e);
        this.settings.eventBus.emit<FailedToConnectEvent>(new FailedToConnectEvent('qwe'));
      });
    });
  }

}

export default HTTPClient;
