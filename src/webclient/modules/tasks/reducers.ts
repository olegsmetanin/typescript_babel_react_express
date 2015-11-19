/// <reference path="../../webclient.d.ts"/>

import {handleAction, handleActions, Action} from 'redux-actions';
import reduceReducers from 'reduce-reducers';
import {Task, Executor, ITasksModuleState, IExecutorEditState} from './model';
import {
  TASKS_REQUEST,
  TASKS_REQUEST_SUCCESS,
  TASKS_REQUEST_FAILURE,
  TASKS_TASK_EXECUTORS_REQUEST,
  TASKS_EXECUTOR_EDIT_MODE,
  TASKS_EXECUTOR_VIEW_MODE,
  TASKS_EXECUTOR_UPDATE_REQUEST
} from './actionTypes';


const initialState: ITasksModuleState = {
  data: {
    tasks: [],
    count: 0,
    executors: [],
  }
};

const handleTaskActions = handleActions<ITasksModuleState>({
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
}, initialState);

//can't using FSA-action with error handling in handleActions (signature disallow reducer-map), so,
//split this reducer into separate part and use reduceReducers in rootReducer for modules
const handleExecutorsActions = handleAction(TASKS_TASK_EXECUTORS_REQUEST, {

  ['next']: (state:ITasksModuleState, action:Action) => {
    switch (action.meta.stage) {
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
      default:
        return state || initialState; //handleAction does not have possibilities to set default state
                                      //and reducer signature can't set default value to first property only
                                      //redux does't like undefined as reducer result
    }
  },

  ['throw']: (state:ITasksModuleState, action:Action) => {
    state = state || initialState; //handleAction does not have possibilities to set default state
                                   //and reducer signature can't set default value to first property only
                                   //redux does't like undefined as reducer result
    const view = Object.assign({}, state.view, {[action.meta.id]: action.payload});//mark loading error

    return Object.assign({}, state, {view});
  }
});

function mergeExecutorEditState(state: ITasksModuleState, taskId: number, executorId: number, estate: IExecutorEditState) {
  const executorEditState = Object.assign({},
    state.view && state.view.editState && state.view.editState[taskId] && state.view.editState[taskId][executorId],
    estate
  );
  const taskExecutorEditState = Object.assign({},
    state.view && state.view.editState && state.view.editState[taskId],
    {[executorId]: executorEditState}
  );
  const editState = Object.assign({}, state.view && state.view.editState, {[taskId]: taskExecutorEditState});
  const view = Object.assign({}, state.view, {editState});

  return Object.assign({}, state, {view});
}

const handleEditActions = handleActions<ITasksModuleState>({
  [TASKS_EXECUTOR_EDIT_MODE]: (state: ITasksModuleState, action: Action) => {
    const {taskId, executorId} = action.payload;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: false, progress: false});
  },

  [TASKS_EXECUTOR_VIEW_MODE]: (state: ITasksModuleState, action: Action) => {
    const {taskId, executorId} = action.payload;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: true, progress: false});
  },
}, initialState);

const handleUpdateActions = handleAction(TASKS_EXECUTOR_UPDATE_REQUEST, {

  ['next']: (state:ITasksModuleState, action:Action) => {
    switch (action.meta.stage) {
      case 'begin':
      {
        const {taskId, executorId} = action.meta;
        return mergeExecutorEditState(state, taskId, executorId, {viewMode: false, progress: true});
      }
      case 'success':
      {
        const {taskId, executorId} = action.meta;
        const newState = mergeExecutorEditState(state, taskId, executorId, {viewMode: true, progress: false});
        //It's safe to mutate newState here
        const executorIndex = newState.data.executors.findIndex(e => e.id === executorId);
        if (executorIndex >= 0) {
          newState.data.executors.splice(executorIndex, 1, action.payload);
        }

        return newState;
      }
      default:
        return state || initialState; //handleAction does not have possibilities to set default state
                                      //and reducer signature can't set default value to first property only
                                      //redux does't like undefined as reducer result
    }
  },

  ['throw']: (state:ITasksModuleState, action:Action) => {
    state = state || initialState; //handleAction does not have possibilities to set default state
                                   //and reducer signature can't set default value to first property only
                                   //redux does't like undefined as reducer result
    const {taskId, executorId} = action.meta;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: false, progress: false, error: action.payload});
  }
});

const tasksReducer = reduceReducers(handleTaskActions, handleExecutorsActions, handleEditActions, handleUpdateActions);

export default tasksReducer
