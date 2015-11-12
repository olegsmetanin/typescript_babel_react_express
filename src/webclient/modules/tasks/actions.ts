/// <reference path="../../webclient.d.ts"/>

import {createAction} from 'redux-actions';
import {Dispatch} from 'redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {Task, TaskStatus} from './model';
import * as ActionTypes from './actionTypes';
import TasksApi from './api';

const tasksRequestBegin = createAction(ActionTypes.TASKS_REQUEST);

const tasksRequestSuccess = createAction<any>(
  ActionTypes.TASKS_REQUEST_SUCCESS,
  (data) => data
);

const tasksRequestFailure = (e: Error) => {
  const action = createAction(ActionTypes.TASKS_REQUEST_FAILURE, (e:Error) => e)(e);
  action.error = true;
  return action;
}

const requestTasks = (search: string, httpClient: IHTTPClient) => (dispatch: Dispatch) => {

  console.log(`${new Date().toISOString()} tasks request called with ${search}`);
  dispatch(tasksRequestBegin());
  const api = new TasksApi({httpClient});
  return api.find({search}).then(
    result => dispatch(tasksRequestSuccess(result)),
    error => dispatch(tasksRequestFailure(error))
  ).then(() => console.log(`${new Date().toISOString()} tasks request finished for ${search}`));
}

export {
  requestTasks
}
