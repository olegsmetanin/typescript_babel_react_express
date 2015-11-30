import ApiCaller from '../../../framework/client/invoke/api';

export interface ITasksApi {

  find(options: {search: string}): Promise<any>;

  executors(options: {ids: number[]}): Promise<any>;

  updateExecutor(options: {id: number, name: string}): Promise<any>;
}

export default class TasksApi extends ApiCaller implements ITasksApi {

  find(options: {search: string}) {
    return this._post('/api/tasks/find', options);
  }

  executors(options: {ids: number[]}) {
    return this._post('/api/tasks/executors', options);
  }

  updateExecutor(options: {id: number, name: string}) {
    return this._post('/api/tasks/executors/update', options);
  }
}
