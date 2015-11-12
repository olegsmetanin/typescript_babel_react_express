import IHTTPClient from "../../../framework/common/http/IHTTPClient";

export default class TasksApi {

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

  //TODO @deduplicate decorator
  async find(options: {search: string}) {
    return this._post('/api/tasks/find', options);
  }

}
