import ApiCaller from '../../../../framework/client/invoke/api';
import {IListItemsRequest, IListItemsResponse} from './model';

export interface IListFormApi {
  items(options: IListItemsRequest): Promise<IListItemsResponse>;
}

export default class ListFormApi extends ApiCaller implements IListFormApi {

  items(options: IListItemsRequest) {
    return this._post('/api/list-items', options);
  }

}
