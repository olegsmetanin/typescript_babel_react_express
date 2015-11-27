import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';
import {Task, Executor, IModuleState, ITasksState, IExecutorEditState, IExecutorsState, IEditState} from './model';
import {
  TASKS_REQUEST,
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


const handleTasksLoad = handleActions<ITasksState>({
  [`${TASKS_REQUEST}_BEGIN`]: (state) => {
    const ui = Object.assign({}, state.ui, {loading: true});
    return Object.assign({}, state, {ui});
  },

  [`${TASKS_REQUEST}_SUCCESS`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {loading: false, error: undefined});
    return Object.assign({}, state, {
      items: action.payload.tasks,
      count: action.payload.count,
      ui,
    });
  },

  [`${TASKS_REQUEST}_FAILURE`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {
      error: action.payload,
      loading: false,
    });
    return Object.assign({}, state, {ui});
  },
}, initialState.tasks);


const handleExecutorsLoad = handleActions<IExecutorsState>({

  [`${TASKS_TASK_EXECUTORS_REQUEST}_BEGIN`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {[action.meta.id]: true});//mark loading started
    return Object.assign({}, state, {ui});
  },

  [`${TASKS_TASK_EXECUTORS_REQUEST}_SUCCESS`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {[action.meta.id]: false});
    return Object.assign({}, state, {
      executors: [...state.executors, ...action.payload],
      ui,
    });
  },

  [`${TASKS_TASK_EXECUTORS_REQUEST}_FAILURE`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {[action.meta.id]: action.payload});//mark loading error
    return Object.assign({}, state, {ui});
  }
}, initialState.details);


function mergeExecutorEditState(state: IEditState, taskId: number, executorId: number, value: IExecutorEditState) {
  const executorEditState = Object.assign({}, state[taskId] && state[taskId][executorId], value);
  const taskEditState = Object.assign({}, state[taskId], {[executorId]: executorEditState});

  return Object.assign({}, state, {[taskId]: taskEditState});
}

const handleModeActions = handleActions<IEditState>({
  [TASKS_EXECUTOR_EDIT_MODE]: (state, action) => {
    const {taskId, executorId} = action.payload;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: false, progress: false});
  },

  [TASKS_EXECUTOR_VIEW_MODE]: (state, action) => {
    const {taskId, executorId} = action.payload;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: true, progress: false});
  },
}, initialState.editors);

const handleEditActions = handleActions<IEditState>({
  [`${TASKS_EXECUTOR_UPDATE_REQUEST}_BEGIN`]: (state, action) => {
    const {taskId, executorId} = action.meta;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: false, progress: true});
  },

  [`${TASKS_EXECUTOR_UPDATE_REQUEST}_SUCCESS`]: (state, action) => {
    const {taskId, executorId} = action.meta;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: true, progress: false, error: undefined});
  },

  [`${TASKS_EXECUTOR_UPDATE_REQUEST}_FAILURE`]: (state, action) => {
    const {taskId, executorId} = action.meta;
    return mergeExecutorEditState(state, taskId, executorId, {viewMode: false, progress: false, error: action.payload});
  }
}, initialState.editors);


const handleExecutorUpdate = handleActions<IExecutorsState>({
  [`${TASKS_EXECUTOR_UPDATE_REQUEST}_SUCCESS`]: (state, action) => {
    const {executorId} = action.meta;

    const newState = Object.assign({}, state, {executors: [...state.executors]});
    const executorIndex = state.executors.findIndex(e => e.id === executorId);
    if (executorIndex >= 0) {
      //It's safe to mutate newState here
      newState.executors.splice(executorIndex, 1, action.payload);
    }

    return newState;
  }
}, initialState.details);


export default combineReducers({
  tasks: handleTasksLoad,
  details: reduceReducers(handleExecutorsLoad, handleExecutorUpdate),
  editors: reduceReducers(handleModeActions, handleEditActions),
})
