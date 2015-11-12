/// <reference path="../webclient.d.ts"/>

import {combineReducers} from 'redux';

import tasksReducer from './tasks/reducers';

const rootReducer = combineReducers({
  tasks: tasksReducer
  //TODO other modules
});

export { rootReducer };
