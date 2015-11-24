/// <reference path="../webclient.d.ts"/>

import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';

import tasksReducer from './tasks/reducers';
import authReducer from './auth/reducers';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  auth: authReducer
  //TODO other modules
});

export { rootReducer };
