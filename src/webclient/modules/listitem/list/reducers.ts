import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';
import {IListState} from './model';
import {IListItemsResponse} from './model';
import {LISTFORM_SEARCH} from './actionTypes';

const initialState: IListState = {
  items: [],
  count: 0,
  filter: {search: ''},

  ui: {loading: false},
};

export default handleActions<IListState>({

  [`${LISTFORM_SEARCH}_BEGIN`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {loading: true});
    const filter = action.payload;
    return Object.assign({}, state, {filter, ui});
  },

  [`${LISTFORM_SEARCH}_SUCCESS`]: (state, action) => {
    const res: IListItemsResponse = action.payload;

    const items = action.meta.append ? state.items.concat(res.items) : res.items;
    const count = res.count;
    const ui = Object.assign({}, state.ui, {loading: false, errors: undefined});

    return Object.assign({}, state, {items, count, ui});
  },

  [`${LISTFORM_SEARCH}_FAILURE`]: (state, action) => {
    const ui = Object.assign({}, state.ui, {loading: false, errors: action.payload})
    return Object.assign({}, state, {ui});
  }

}, initialState);

