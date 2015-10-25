import IHTTPClient, {IHTTPRequest} from '../../server/interfaces/IHTTPClient';

require('whatwg-fetch');
var fetch = window['fetch'];

class HTTPClient implements IHTTPClient {
  send(request: IHTTPRequest) {
    return fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(request.data)
    }).then(response => {
      return response.json()
    })
  }
}

export default HTTPClient;
