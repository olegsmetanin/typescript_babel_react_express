import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';
import {IUserState} from './model';
import {ME_REQUEST, LOGOUT_REQUEST} from './actionTypes';


const initialState: IUserState = {
  me: undefined,
  ui: {
    loading: true,
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

  [`${LOGOUT_REQUEST}_SUCCESS`]: () => {
    return {
      me: undefined,
      ui: {
        loading: false,
      }
    }
  },

}, initialState);

export default handleAuthActions
