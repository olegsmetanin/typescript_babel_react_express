import {handleActions} from 'redux-actions';
import {FormData, IModuleState} from './model';
import {LOAD_FORM, SAVE_FORM, UPDATE_FORM} from './actionTypes';

const initialState: IModuleState = {
  data: null,
  ui: {
    loading: false,
    saving: false
  }
};

export default handleActions<IModuleState>({

  [`${LOAD_FORM}_BEGIN`]: (state) => {
    const ui = Object.assign({}, state.ui, {loading: true});
    return Object.assign({}, state, {ui});
  },

  [`${LOAD_FORM}_SUCCESS`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {loading: false, errors: undefined});
    return Object.assign({}, state, {data: action.payload, ui});
  },

  [`${LOAD_FORM}_FAILURE`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {loading: false, errors: action.payload});
    return Object.assign({}, state, {ui});
  },


  [UPDATE_FORM]: (state, action) => {
    return Object.assign({}, state, {data: action.payload});
  },


  [`${SAVE_FORM}_BEGIN`]: (state) => {
    const ui = Object.assign({}, state.ui, {saving: true});
    return Object.assign({}, state, {ui});
  },

  [`${SAVE_FORM}_SUCCESS`]: (state) => {
    const ui = Object.assign({}, state.ui, {saving: false, errors: undefined});
    return Object.assign({}, state, {ui});
  },

  [`${SAVE_FORM}_FAILURE`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {saving: false, errors: action.payload});
    return Object.assign({}, state, {ui});
  },

}, initialState);
