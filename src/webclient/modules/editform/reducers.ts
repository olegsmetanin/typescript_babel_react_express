import {handleActions} from 'redux-actions';
import {FormData, IModuleState} from './model';
import {LOAD_FORM, SAVE_FORM, EDIT_FORM, VALIDATE_FORM} from './actionTypes';

const initialState: IModuleState = {
  data: null,
  ui: {
    editMode: false,
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


  [EDIT_FORM]: (state) => {
    const ui = Object.assign({}, state.ui, {editMode: true});
    return Object.assign({}, state, {ui});
  },

  [VALIDATE_FORM]: (state, action) => {
    const ui = Object.assign({}, state.ui, {errors: action.payload});
    return Object.assign({}, state, {ui});
  },


  [`${SAVE_FORM}_BEGIN`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {saving: true});
    return Object.assign({}, state, {data: action.payload, ui});//optimistic update. should have rollback path in case of error from api
  },

  [`${SAVE_FORM}_SUCCESS`]: (state) => {
    const ui = Object.assign({}, state.ui, {saving: false, editMode: false, errors: undefined});
    return Object.assign({}, state, {ui});
  },

  [`${SAVE_FORM}_FAILURE`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {saving: false, editMode: false, errors: action.payload});
    return Object.assign({}, state, {ui});
  },

}, initialState);
