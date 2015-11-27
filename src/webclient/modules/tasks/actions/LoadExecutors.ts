import {AsyncTaskAction} from './AbstractTaskAction';
import {ITasksApi} from '../api';
import {IExecutorsState} from '../model';


export class LoadExecutors extends AsyncTaskAction<IExecutorsState> {

  constructor(options: {api: ITasksApi, defaultState: IExecutorsState}) {
    super({api: options.api, type: 'TASKS_TASK_EXECUTORS_REQUEST', defaultState: options.defaultState})
  }

  send = (id:number, ids:number[]) => {
    return {
      type: this.type,
      payload: {
        promise: this.api.executors({ids})
      },
      meta: {id}
    }
  };

  _reduce(state, action) {
    switch(action.type) {
      case `${this.type}_BEGIN`:
      {
        const ui = Object.assign({}, state.ui, {[action.meta.id]: true});//mark loading started
        return Object.assign({}, state, {ui});
      }
        break;
      case `${this.type}_SUCCESS`:
      {
        const ui = Object.assign({}, state.ui, {[action.meta.id]: false});
        return Object.assign({}, state, {
          executors: [...state.executors, ...action.payload],
          ui,
        });
      }
        break;
      case `${this.type}_FAILURE`:
      {
        const ui = Object.assign({}, state.ui, {[action.meta.id]: action.payload});//mark loading error
        return Object.assign({}, state, {ui});
      }
        break;
      default:
        return state;
    }
  }

}
