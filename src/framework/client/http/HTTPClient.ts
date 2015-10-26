import IHTTPClient, {IHTTPRequest} from '../../common/http/IHTTPClient';

require('whatwg-fetch');
var fetch = window['fetch'];

class HTTPClient implements IHTTPClient {

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
      }, reject);
    });
  }

}

export default HTTPClient;
