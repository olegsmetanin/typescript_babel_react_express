/// <reference path="../webclient.d.ts"/>

import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';

import tasksReducer from './tasks/reducers';
import meReducer from './auth/reducers';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  me: meReducer
  //TODO other modules
});

export { rootReducer };
