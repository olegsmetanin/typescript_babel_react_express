import {Action, AsyncAction} from './base';
import {ITasksApi} from '../api';

export abstract class TaskAction<T> extends Action<T> {

  api: ITasksApi;

  constructor(options: {api: ITasksApi, type: string, defaultState: T}) {
    super(options.type, options.defaultState);

    this.api = options.api;
  }

}

export abstract class AsyncTaskAction<T> extends AsyncAction<T> {

  api: ITasksApi;

  constructor(options: {api: ITasksApi, type: string, defaultState: T}) {
    super(options.type, options.defaultState);

    this.api = options.api;
  }

}
