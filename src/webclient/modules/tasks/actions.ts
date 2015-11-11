/// <reference path="../../webclient.d.ts"/>

import {createAction} from 'redux-actions';
import {Dispatch} from 'redux';
import {Task, TaskStatus} from './model';
import * as ActionTypes from './actionTypes';

const tasksRequestBegin = createAction(ActionTypes.TASKS_REQUEST);

const tasksRequestSuccess = createAction<any>(
  ActionTypes.TASKS_REQUEST_SUCCESS,
  (data) => data
);

const tasksRequestFailure = () => {
  const action = createAction(ActionTypes.TASKS_REQUEST_FAILURE, (e:Error) => e)();
  action.error = true;
  return action;
}

const requestTasks = (search: string) => (dispatch: Dispatch) => {

    //TODO api call
    console.log(`${new Date().toISOString()} tasks request called with ${search}`);
    dispatch(tasksRequestBegin());
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        console.log(`${new Date().toISOString()} tasks request finished for ${search}`);

        const stub = {
          tasks: <Task[]>[
            {id: 1, title: 'First task', status: TaskStatus.NEW},
            {id: 2, title: 'Second task', status: TaskStatus.RUNNING},
            {id: 3, title: 'Third task', status: TaskStatus.DONE},
          ],
          count: 22,
        };

        dispatch(tasksRequestSuccess(stub));
        resolve();
      }, 500);
    });
}

export {
  requestTasks
}
