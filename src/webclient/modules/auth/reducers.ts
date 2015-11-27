/// <reference path="../../webclient.d.ts"/>

import {handleAction, handleActions, Action} from 'redux-actions';
import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';
import {IUser, IUserState} from './model';
import {
  ME_REQUEST,
  ME_REQUEST_SUCCESS,
  ME_REQUEST_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_REQUEST_SUCCESS,
  LOGOUT_REQUEST_FAILURE
} from './actionTypes';


const initialState: IUserState = {
  me: undefined,
  ui: {
    loading: true,
  }
};

const handleAuthActions = handleActions<IUserState>({
  [ME_REQUEST]: (state: IUserState, action: Action) => {
    const ui = Object.assign({}, state.ui, {loading: true});
    return Object.assign({}, state, {ui});
  },

  [ME_REQUEST_SUCCESS]: (state: IUserState, action: Action) => {
    const ui = Object.assign({}, state.ui, {loading: false});
    return Object.assign({}, state, {
        me: (Object.keys(action.payload).length > 0 ? action.payload : null),
        ui
    });
  },

  [ME_REQUEST_FAILURE]: (state: IUserState, action: Action) => {
    const ui = Object.assign({}, state.ui, {
      error: action.payload,
      loading: false,
    });
    return Object.assign({}, state, {ui});
  },

  [LOGOUT_REQUEST_SUCCESS]: (state: IUserState, action: Action) => {
    return {
      me: undefined,
      ui: {
        loading: false,
      }
    }
  },

}, initialState);

export default combineReducers({
  auth: handleAuthActions
})
