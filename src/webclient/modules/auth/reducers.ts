import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';
import {IUserState} from './model';
import {ME_REQUEST, LOGIN_REQUEST, LOGOUT_REQUEST, POPUP_MODE_CHANGE} from './actionTypes';


const initialState: IUserState = {
  me: undefined,
  ui: {
    loading: true,
  },
  popup: {
    open: false,
    auth: false,
    reconnect: false,
  }
};

const handleAuthActions = handleActions<IUserState>({

  [`${ME_REQUEST}_BEGIN`]: (state) => {
    const ui = Object.assign({}, state.ui, {loading: true});
    return Object.assign({}, state, {ui});
  },

  [`${ME_REQUEST}_SUCCESS`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {loading: false});
    const me = (Object.keys(action.payload).length > 0 ? action.payload : null);

    return Object.assign({}, state, {me, ui});
  },

  [`${ME_REQUEST}_FAILURE`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {
      error: action.payload,
      loading: false,
    });
    return Object.assign({}, state, {ui});
  },

  [`${LOGOUT_REQUEST}_SUCCESS`]: (state) => {
    return Object.assign({}, state, {
      me: undefined,
      ui: {
        loading: false,
      }
    });
  },

  [POPUP_MODE_CHANGE]: (state, action) => {
    return Object.assign({}, state, {popup: action.payload});
  },

  [`${LOGIN_REQUEST}_SUCCESS`]: (state) => {
    const popup = {
      open: false,
      auth: false,
      reconnect: false
    };
    return Object.assign({}, state, {popup});
  },

  [`${LOGIN_REQUEST}_FAILURE`]: (state, action) => {
    const popup = Object.assign({}, state.popup, {errors: action.payload});
    return Object.assign({}, state, {popup});
  }

}, initialState);

export default handleAuthActions
