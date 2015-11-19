/// <reference path="../../webclient.d.ts"/>

import {handleAction, handleActions, Action} from 'redux-actions';
import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';
import {Task, Executor, IModuleState, ITasksState, IExecutorEditState, IExecutorsState, IEditState} from './model';
import {
  TASKS_REQUEST,
  TASKS_REQUEST_SUCCESS,
  TASKS_REQUEST_FAILURE,
  TASKS_TASK_EXECUTORS_REQUEST,
  TASKS_EXECUTOR_EDIT_MODE,
  TASKS_EXECUTOR_VIEW_MODE,
  TASKS_EXECUTOR_UPDATE_REQUEST
} from './actionTypes';


const initialState: IModuleState = {
  tasks: {
    items: [],
    count: 0,
    ui: {
      loading: false,
    },
  },
  details: {
    executors: [],
    ui: {},
  },
  editors: {},
};

const handleTaskActions = handleActions<ITasksState>({
  [TASKS_REQUEST]: (state: ITasksState, action: Action) => {
    const ui = Object.assign({}, state.ui, {loading: true});
    return Object.assign({}, state, {ui});
  },

  [TASKS_REQUEST_SUCCESS]: (state: ITasksState, action: Action) => {
    const ui = Object.assign({}, state.ui, {loading: false});
    return Object.assign({}, state, {
      items: action.payload.tasks,
      count: action.payload.count,
      ui,
    });
  },

  [TASKS_REQUEST_FAILURE]: (state: ITasksState, action: Action) => {
    const ui = Object.assign({}, state.ui, {
      error: action.payload,
      loading: false,
    });
    return Object.assign({}, state, {ui});
  },
}, initialState.tasks);

//can't using FSA-action with error handling in handleActions (signature disallow reducer-map), so,
//split this reducer into separate part and use reduceReducers in rootReducer for modules
const handleExecutorsActions = handleAction(TASKS_TASK_EXECUTORS_REQUEST, {

  ['next']: (state:IExecutorsState, action:Action) => {
    switch (action.meta.stage) {
      case 'begin':
      {
        const ui = Object.assign({}, state.ui, {[action.meta.id]: true});//mark loading started
        return Object.assign({}, state, {ui});
      }
      case 'success':
      {
        const ui = Object.assign({}, state.ui, {[action.meta.id]: false});
        return Object.assign({}, state, {
          executors: [...state.executors, ...action.payload],
          ui,
        });
      }
      default:
        return state || initialState.details; //handleAction does not have possibilities to set default state
                                              //and reducer signature can't set default value to first property only
                                              //redux does't like undefined as reducer result
    }
  },

  ['throw']: (state:IExecutorsState, action:Action) => {
    state = state || initialState.details; //see comment above
    const ui = Object.assign({}, state.ui, {[action.meta.id]: action.payload});//mark loading error
    return Object.assign({}, state, {ui});
  }
});

function mergeExecutorEditState(state: IEditState, taskId: number, executorId: number, value: IExecutorEditState) {
  const executorEditState = Object.assign({}, state[taskId] && state[taskId][executorId], value);
  const taskEditState = Object.assign({}, state[taskId], {[executorId]: executorEditState});

  return Object.assign({}, state, {[taskId]: taskEditState});
}

const handleModeActions = handleActions<IEditState>({
  [TASKS_EXECUTOR_EDIT_MODE]: (state: IEditState, action: Action) => {
    const {taskId, executorId} = action.payload;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: false, progress: false});
  },

  [TASKS_EXECUTOR_VIEW_MODE]: (state: IEditState, action: Action) => {
    const {taskId, executorId} = action.payload;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: true, progress: false});
  },
}, initialState.editors);

const handleUpdateExecutor = handleAction<IExecutorsState>(TASKS_EXECUTOR_UPDATE_REQUEST, (state, action) => {
  let newState = state || initialState.details;

  if (action.meta.stage === 'success') {
    const {taskId, executorId} = action.meta;

    const executorIndex = newState.executors.findIndex(e => e.id === executorId);
    if (executorIndex >= 0) {
      newState = Object.assign({}, newState, {executors: [...newState.executors]});
      //It's safe to mutate newState here
      newState.executors.splice(executorIndex, 1, action.payload);
    }
  }

  return newState;
});

const handleUpdateActions = handleAction(TASKS_EXECUTOR_UPDATE_REQUEST, {

  ['next']: (state:IEditState, action:Action) => {
    switch (action.meta.stage) {
      case 'begin':
      {
        const {taskId, executorId} = action.meta;
        return mergeExecutorEditState(state, taskId, executorId, {viewMode: false, progress: true});
      }
      case 'success':
      {
        const {taskId, executorId} = action.meta;
        return mergeExecutorEditState(state, taskId, executorId, {viewMode: true, progress: false});
      }
      default:
        return state || initialState.editors; //handleAction does not have possibilities to set default state
                                      //and reducer signature can't set default value to first property only
                                      //redux does't like undefined as reducer result
    }
  },

  ['throw']: (state:IEditState, action:Action) => {
    state = state || initialState.editors;

    const {taskId, executorId} = action.meta;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: false, progress: false, error: action.payload});
  }
});

export default combineReducers({
  tasks: handleTaskActions,
  details: (state, action) => {
    //fix FSA no-default-state-for-handle-action
    return reduceReducers(handleExecutorsActions, handleUpdateExecutor)(state, action) || initialState.details;
  },
  editors: reduceReducers(handleModeActions, handleUpdateActions)
})
