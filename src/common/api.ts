import {IListItem} from './model';

export interface IListItemsFilter {
  search? : string;
}

export interface IListItemsRequest {
  filter: IListItemsFilter;
  offset: number;
}

export interface IListItemsResponse {
  items: IListItem[];
  count: number;
}
