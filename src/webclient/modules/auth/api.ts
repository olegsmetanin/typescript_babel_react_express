import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import deduplicate from '../../../framework/client/invoke/deduplicate';

export default class AuthApi {

  httpClient: IHTTPClient;

  constructor(options: {httpClient: IHTTPClient}) {
    this.httpClient = options.httpClient;
  }

  private _post(url, data) {
    return this.httpClient.send({
      method: 'post',
      url,
      data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  @deduplicate
  me() {
    return this._post('/api/me', null);
  }
  
}
