import IHTTPClient from '../../common/http/IHTTPClient';
import deduplicate from './deduplicate';

abstract class ApiCaller {

  private httpClient: IHTTPClient;

  constructor(options: {httpClient: IHTTPClient}) {
    this.httpClient = options.httpClient;
  }

  @deduplicate
  protected _post(url, data) {
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

}

export default ApiCaller;
