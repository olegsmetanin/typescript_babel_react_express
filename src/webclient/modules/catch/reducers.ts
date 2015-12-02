import {handleActions} from 'redux-actions';
import {IModuleState} from './model';
import {THROW_REQUEST, AUTH_ONLY_REQUEST} from './actionTypes';

const initialState: IModuleState = {
  callNumber: 0
};

const reducers = handleActions({

  [`${THROW_REQUEST}_BEGIN`]: (state, action) => {
    console.log('begin', state, action);
    return Object.assign({}, state, {callNumber: action.payload });
  },

  [`${THROW_REQUEST}_SUCCESS`]: (state) => {
    console.log('success', state);
    return Object.assign({}, state, {errors: {general: 'Error not catched!!!'} });
  },

  [`${THROW_REQUEST}_FAILURE`]: (state, action) => {
    console.log('fail', state, action);
    return Object.assign({}, state, {errors: action.payload.errors });
  },

  [`${AUTH_ONLY_REQUEST}_SUCCESS`]: (state, action) => {
    return Object.assign({}, state, {data: action.payload, errors: undefined });
  },

  [`${AUTH_ONLY_REQUEST}_FAILURE`]: (state, action) => {
    return Object.assign({}, state, {errors: action.payload });
  },

}, initialState);

export default reducers
