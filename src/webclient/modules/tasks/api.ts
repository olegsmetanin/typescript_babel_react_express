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
  find(options: {search: string}) {
    return this._post('/api/tasks/find', options);
  }

  //@deduplicate
  executors(options: {ids: number[]}) {
    return this._post('/api/tasks/executors', options);
  }
}
