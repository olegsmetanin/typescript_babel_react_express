/// <reference path="../webclient.d.ts"/>

import {combineReducers} from 'redux';

import indexReducer from './index/reducers';
import tasksReducer from './tasks/reducers';
import authReducer from './auth/reducers';
import pingpongReducer from './pingpong/reducers';
import catchReducer from './catch/reducers';
import editFormReducer from './editform/reducers';
import listitemReducer from './listitem/reducers';

const rootReducer = combineReducers({
  index    : indexReducer,
  tasks    : tasksReducer,
  auth     : authReducer,
  pingpong : pingpongReducer,
  catch    : catchReducer,
  editform : editFormReducer,
  listitem : listitemReducer,
});

export { rootReducer };
