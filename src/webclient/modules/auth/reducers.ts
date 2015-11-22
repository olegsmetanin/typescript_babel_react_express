/// <reference path="../../webclient.d.ts"/>

import {handleAction, handleActions, Action} from 'redux-actions';
import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';
import {IUser, IAuthState} from './model';
import {
  ME_REQUEST,
  ME_REQUEST_SUCCESS,
  ME_REQUEST_FAILURE
} from './actionTypes';


const initialState: IAuthState = {
  me: undefined,
  ui: {
    loading: false,
  },
};

const handleMeActions = handleActions<IAuthState>({
  [ME_REQUEST]: (state: IAuthState, action: Action) => {
    const ui = Object.assign({}, state.ui, {loading: true});
    return Object.assign({}, state, {ui});
  },

  [ME_REQUEST_SUCCESS]: (state: IAuthState, action: Action) => {
    const ui = Object.assign({}, state.ui, {loading: false});
    return Object.assign({}, state, {
      me: action.payload,
      ui,
    });
  },

  [ME_REQUEST_FAILURE]: (state: IAuthState, action: Action) => {
    const ui = Object.assign({}, state.ui, {
      error: action.payload,
      loading: false,
    });
    return Object.assign({}, state, {ui});
  },
}, initialState);

export default combineReducers({
  me: handleMeActions
})
