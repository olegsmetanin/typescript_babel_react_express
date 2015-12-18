import {combineReducers} from 'redux';
import listReducers from './list/reducers';
import formReducers from './form/reducers';

export default combineReducers({
  list: listReducers,
  form: formReducers,
});
