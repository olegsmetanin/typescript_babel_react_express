/// <reference path="../../webclient.d.ts"/>

import {handleActions, Action} from 'redux-actions';

import {Task, Executor, ITasksModuleState} from './model';
import {TASKS_REQUEST, TASKS_REQUEST_SUCCESS, TASKS_REQUEST_FAILURE, TASKS_TASK_EXECUTORS_REQUEST} from './actionTypes';

const initialState: ITasksModuleState = {
  data: {
    tasks: [],
    count: 0,
    executors: [],
  }
};

export default handleActions<ITasksModuleState>({
  [TASKS_REQUEST]: (state: ITasksModuleState, action: Action) => {
    const view = Object.assign({}, state.view, {loading: true});

    return Object.assign({}, state, {view});
  },

  [TASKS_REQUEST_SUCCESS]: (state: ITasksModuleState, action: Action) => {
    const data = Object.assign({}, state.data, {
      tasks: action.payload.tasks,
      count: action.payload.count,
    });
    const view = Object.assign({}, state.view, {
      loading: false,
    });

    return Object.assign({}, state, {data, view});
  },

  [TASKS_REQUEST_FAILURE]: (state: ITasksModuleState, action: Action) => {
    const view = Object.assign({}, state.view, {
      error: action.payload,
      loading: false,
    });

    return Object.assign({}, state, {view});
  },

  [TASKS_TASK_EXECUTORS_REQUEST]: (state: ITasksModuleState, action: Action) => {
    switch(action.meta.stage) {
      case 'begin':
      {
        const view = Object.assign({}, state.view, {[action.meta.id]: true});//mark loading started

        return Object.assign({}, state, {view});
      }
      case 'success':
      {
        const view = Object.assign({}, state.view, {[action.meta.id]: false});//mark loading completed
        const data = Object.assign({}, state.data, {executors: [...state.data.executors, ...action.payload]});

        return Object.assign({}, state, {data, view});
      }
      case 'failure':
      {
        const view = Object.assign({}, state.view, {[action.meta.id]: action.payload});//mark loading error

        return Object.assign({}, state, {view});
      }
      default:
        return state;
    }
  }

}, initialState);
