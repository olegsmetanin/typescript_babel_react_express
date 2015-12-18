import {IListItemsFilter} from './model';
import {IListFormApi} from './api';
import * as ActionTypes from './actionTypes';

function factory(options: {api: IListFormApi}) {

  const search = (filter: IListItemsFilter, offset: number = 0) => {
    return {
      type: ActionTypes.LISTFORM_SEARCH,
      payload: {
        promise: options.api.items({filter, offset}),
        data: filter
      },
      meta: {
        append: offset > 0
      }
    }
  };

  return {
    search,
  }

}

export default factory;
