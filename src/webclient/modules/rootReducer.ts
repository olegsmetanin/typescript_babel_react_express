/// <reference path="../webclient.d.ts"/>

import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';

import {handleTaskActions, handleExecutorsActions} from './tasks/reducers';

const rootReducer = combineReducers({
  tasks: reduceReducers(handleTaskActions, handleExecutorsActions)
  //TODO other modules
});

export { rootReducer };
