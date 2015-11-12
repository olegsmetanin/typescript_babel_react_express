/// <reference path="../../webclient.d.ts"/>

import {handleActions, Action} from 'redux-actions';

import {Task, ITasksModuleState} from './model';
import {TASKS_REQUEST, TASKS_REQUEST_SUCCESS, TASKS_REQUEST_FAILURE} from './actionTypes';

const initialState: ITasksModuleState = {
  tasks: Task[0],
  count: 0,
};

export default handleActions<ITasksModuleState>({
  [TASKS_REQUEST]: (state, action) => Object.assign({}, state, {loading: true}),

  [TASKS_REQUEST_SUCCESS]: (state, action) => Object.assign({}, state, {
    tasks: action.payload.tasks,
    count: action.payload.count,
    loading: false,
  }),

  [TASKS_REQUEST_FAILURE]: (state, action) => Object.assign({}, state, {
    error: action.payload,
    loading: false,
  }),
}, initialState);
