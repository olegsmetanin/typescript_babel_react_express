import IHTTPClient, {IHTTPRequest} from '../../common/http/IHTTPClient';
import {AuthenticationRequiredError, ConnectionBrokenError} from "./Errors";

require('whatwg-fetch');
var fetch = window['fetch'];

interface IHTTPClientSettings {
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
        credentials: 'same-origin',
        body: request.data && JSON.stringify(request.data)
      }).then(response => {
        if (response.ok) {
          const contentLength = parseInt(response.headers.get('Content-Length'), 10);
          if (contentLength > 0) {
            response.json().then(json => resolve(json));
          } else {
            resolve();
          }
        } else {
          if (response.status === 401) {
            reject(new AuthenticationRequiredError());
          } else if (response.status === 400) {
            //new APIError extends HTTPError?
            response.json().then(json => reject(json));
          } else {
            //FIXME custom error shape with response or extracted info?
            //new APIError extends HTTPError?
            reject(response);
          }
        }
      }, () => {
        reject(new ConnectionBrokenError());
      });
    });
  }

}

export default HTTPClient;
