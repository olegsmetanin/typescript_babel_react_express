/// <reference path="../webclient.d.ts"/>

import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';

import {handleTaskActions, handleExecutorsActions, handleEditActions, handleUpdateActions} from './tasks/reducers';

const rootReducer = combineReducers({
  tasks: reduceReducers(handleTaskActions, handleExecutorsActions, handleEditActions, handleUpdateActions)
  //TODO other modules
});

export { rootReducer };
