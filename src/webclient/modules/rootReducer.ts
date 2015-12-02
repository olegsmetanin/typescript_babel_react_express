/// <reference path="../webclient.d.ts"/>

import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';

import tasksReducer from './tasks/reducers';
import authReducer from './auth/reducers';
import pingpongReducer from './pingpong/reducers';
import catchReducer from './catch/reducers';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  auth: authReducer,
  pingpong: pingpongReducer,
  catch: catchReducer,
});

export { rootReducer };
