import {combineReducers} from 'redux';
import listReducers from './list/reducers';

export default combineReducers({
  list: listReducers
});
