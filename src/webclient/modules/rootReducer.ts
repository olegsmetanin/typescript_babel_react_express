/// <reference path="../webclient.d.ts"/>

import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';

import tasksReducer from './tasks/reducers';

const rootReducer = combineReducers({
  tasks: tasksReducer
  //TODO other modules
});

export { rootReducer };
