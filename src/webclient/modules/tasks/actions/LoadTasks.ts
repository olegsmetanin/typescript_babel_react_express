import {AsyncTaskAction} from './AbstractTaskAction';
import {ITasksApi} from '../api';
import {ITasksState} from '../model';


export class LoadTasks extends AsyncTaskAction<ITasksState> {

  constructor(options: {api: ITasksApi, defaultState: ITasksState}) {
    super({api: options.api, type: 'TASKS_REQUEST', defaultState: options.defaultState})
  }

  send = (search: string) => {
    return {
      type: this.type,
      payload: {
        promise: this.api.find({search})
      }
    }
  }

  _reduce(state, action) {
    switch(action.type) {
      case `${this.type}_BEGIN`:
        {
          const ui = Object.assign({}, state.ui, {loading: true});
          return Object.assign({}, state, {ui});
        }
        break;
      case `${this.type}_SUCCESS`:
        {
          const ui = Object.assign({}, state.ui, {loading: false, error: undefined});
          return Object.assign({}, state, {
            items: action.payload.tasks,
            count: action.payload.count,
            ui,
          });
        }
        break;
      case `${this.type}_FAILURE`:
        {
          const ui = Object.assign({}, state.ui, {
            error: action.payload,
            loading: false,
          });
          return Object.assign({}, state, {ui});
        }
        break;
      default:
        return state;
    }
  }

}