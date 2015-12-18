import {IListItem} from '../../../../common/model';//TODO not working, why? '../model'
import {IListItemsFilter} from '../../../../common/api';

export interface IListState {
  items  : IListItem[];
  count  : number;
  filter : IListItemsFilter;

  ui: {
    loading: boolean;
    errors?: Error;
  }
}

export {IListItemsFilter, IListItemsRequest, IListItemsResponse} from '../../../../common/api';
