import ApiCaller from '../../../../framework/client/invoke/api';
import {IListItem} from '../../../../common/model';

export interface IFormApi {

  get(options: {id: number}): Promise<IListItem>;

  update(options: IListItem): Promise<IListItem>;
}

export default class FormApi extends ApiCaller implements IFormApi {

  get(options: {id: number}) {
    return this._post('/api/list-items/get', options);
  }

  update(options: IListItem) {
    return this._post('/api/list-items/update', options);
  }

}
