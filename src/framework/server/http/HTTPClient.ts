import IHTTPClient, {IHTTPRequest} from '../../common/http/IHTTPClient';

var node_request = require('request');

class HTTPClient implements IHTTPClient {
  send(request: IHTTPRequest) {

    return new Promise<any>((resolve, reject) => {
      node_request({
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.data),
      }, function(error, response, body) {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body))
          }
        })
    })
  }

}

export default HTTPClient;
