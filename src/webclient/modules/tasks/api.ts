import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import deduplicate from '../../../framework/client/invoke/deduplicate';

export interface ITasksApi {
  find(options: {search: string});
  executors(options: {ids: number[]});
  updateExecutor(options: {id: number, name: string});
}

export default class TasksApi implements ITasksApi {

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
  find(options: {search: string}) {
    return this._post('/api/tasks/find', options);
  }

  @deduplicate
  executors(options: {ids: number[]}) {
    return this._post('/api/tasks/executors', options);
  }

  @deduplicate
  updateExecutor(options: {id: number, name: string}) {
    return this._post('/api/tasks/executors/update', options);
  }
}
