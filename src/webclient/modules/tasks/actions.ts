/// <reference path="../../webclient.d.ts"/>

import {Action, createAction} from 'redux-actions';
import {Dispatch} from 'redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {Task, TaskStatus, Executor} from './model';
import * as ActionTypes from './actionTypes';
import TasksApi from './api';

const requestTasks = (search: string, httpClient: IHTTPClient) => {
  return {
    type: ActionTypes.TASKS_REQUEST,
    payload: {
      promise: new TasksApi({httpClient}).find({search})
    }
  };
};

const requestExecutors = (id: number, ids: number[], httpClient: IHTTPClient) => {
  return {
    type: ActionTypes.TASKS_TASK_EXECUTORS_REQUEST,
    payload: {
      promise: new TasksApi({httpClient}).executors({ids})
    },
    meta: { id }
  };
};


declare type ExecutorModeChange = {taskId: number, executorId: number};

const editExecutor = createAction<ExecutorModeChange>(ActionTypes.TASKS_EXECUTOR_EDIT_MODE,
  (taskId: number, executorId: number): ExecutorModeChange => ({taskId, executorId}));

const cancelExecutor = createAction<ExecutorModeChange>(ActionTypes.TASKS_EXECUTOR_VIEW_MODE,
  (taskId: number, executorId: number): ExecutorModeChange => ({taskId, executorId}));

const executorUpdateRequest = (taskId: number, executorId: number, stage: string, payload?: (string | Executor | Error)) => {
  let a: Action = {
    type: ActionTypes.TASKS_EXECUTOR_UPDATE_REQUEST,
    payload,
    meta: {taskId, executorId, stage}, //wait for https://github.com/acdlite/redux-actions/issues/2 for async support (but now works too)
  };
  //wait for https://github.com/acdlite/redux-actions/pull/16
  if (payload instanceof Error) {
    a.error = true;
  };
  return a;
}

const saveExecutor = (taskId: number, executorId: number, name: string, httpClient: IHTTPClient) => async (dispatch: Dispatch) => {
  dispatch(executorUpdateRequest(taskId, executorId, 'begin'));

  try {
    const executor: Executor = await new TasksApi({httpClient}).updateExecutor({id: executorId, name});
    dispatch(executorUpdateRequest(taskId, executorId, 'success', executor));
  } catch(err) {
    dispatch(executorUpdateRequest(taskId, executorId, 'failure', err));
  }
}

export {
  requestTasks,
  requestExecutors as requestTaskExecutors,
  editExecutor, cancelExecutor, saveExecutor,
}
