import {handleActions} from 'redux-actions';
import {IListItem} from '../../../../common/model';
import {IFormState} from './model';
import {LISTFORM_LOAD, LISTFORM_SAVE, LISTFORM_EDIT, LISTFORM_VALIDATE} from './actionTypes';

const initialState: IFormState = {
  item: null,
  ui: {
    editMode: false,
    loading: false,
    saving: false
  }
};

export default handleActions<IFormState>({

  [`${LISTFORM_LOAD}_BEGIN`]: (state) => {
    const ui = Object.assign({}, state.ui, {loading: true});
    return Object.assign({}, state, {ui});
  },

  [`${LISTFORM_LOAD}_SUCCESS`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {loading: false, errors: undefined});
    return Object.assign({}, state, {item: action.payload, ui});
  },

  [`${LISTFORM_LOAD}_FAILURE`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {loading: false, errors: action.payload});
    return Object.assign({}, state, {ui});
  },


  [LISTFORM_EDIT]: (state) => {
    const ui = Object.assign({}, state.ui, {editMode: true});
    return Object.assign({}, state, {ui});
  },

  [LISTFORM_VALIDATE]: (state, action) => {
    const ui = Object.assign({}, state.ui, {errors: action.payload});
    return Object.assign({}, state, {ui});
  },


  [`${LISTFORM_SAVE}_BEGIN`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {saving: true});
    return Object.assign({}, state, {data: action.payload, ui});//optimistic update. should have rollback path in case of error from api
  },

  [`${LISTFORM_SAVE}_SUCCESS`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {saving: false, editMode: false, errors: undefined});
    const item = action.payload;
    return Object.assign({}, state, {item, ui});
  },

  [`${LISTFORM_SAVE}_FAILURE`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {saving: false, editMode: false, errors: action.payload});
    return Object.assign({}, state, {ui});
  },

}, initialState);
