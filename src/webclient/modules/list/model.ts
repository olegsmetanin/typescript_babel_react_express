import {IListItem} from '../../../common/model';
import {IListItemsFilter} from '../../../common/api';

export interface IListState {
  items  : IListItem[];
  count  : number;
  filter : IListItemsFilter;

  ui: {
    loading: boolean;
    errors?: Error;
  }
}

export interface IModuleState {
  list: IListState;
}

export {IListItem} from '../../../common/model';
export {IListItemsFilter, IListItemsRequest, IListItemsResponse} from '../../../common/api';
