import {handleActions} from 'redux-actions';
import {IModuleState} from './model';
import {DATA_REQUEST} from './actionTypes';

const initialState: IModuleState = {};

export default handleActions({

  [`${DATA_REQUEST}_SUCCESS`]: (state, action) => {
    return Object.assign({}, state, {data: action.payload});
  }

}, initialState);
