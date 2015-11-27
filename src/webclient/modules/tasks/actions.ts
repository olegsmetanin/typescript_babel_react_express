import {createAction} from 'redux-actions';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import * as ActionTypes from './actionTypes';
import TasksApi from './api';

declare type ExecutorModeChange = {taskId: number, executorId: number};

function factory(options: {api: TasksApi}) {

  const {api} = options;

  const requestTasks = (search:string) => {
    return {
      type: ActionTypes.TASKS_REQUEST,
      payload: {
        promise: api.find({search})
      }
    };
  };

  const requestExecutors = (id:number, ids:number[]) => {
    return {
      type: ActionTypes.TASKS_TASK_EXECUTORS_REQUEST,
      payload: {
        promise: api.executors({ids})
      },
      meta: {id}
    };
  };

  const editExecutor = createAction<ExecutorModeChange>(ActionTypes.TASKS_EXECUTOR_EDIT_MODE,
    (taskId:number, executorId:number):ExecutorModeChange => ({taskId, executorId}));

  const cancelExecutor = createAction<ExecutorModeChange>(ActionTypes.TASKS_EXECUTOR_VIEW_MODE,
    (taskId:number, executorId:number):ExecutorModeChange => ({taskId, executorId}));

  const saveExecutor = (taskId:number, executorId:number, name:string) => {
    return {
      type: ActionTypes.TASKS_EXECUTOR_UPDATE_REQUEST,
      payload: {
        promise: api.updateExecutor({id: executorId, name})
      },
      meta: {taskId, executorId}
    };
  };

  return {
    requestTasks,
    requestTaskExecutors: requestExecutors,
    editExecutor,
    cancelExecutor,
    saveExecutor,
  };

}

export default factory;
