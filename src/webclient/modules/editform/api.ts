import ApiCaller from '../../../framework/client/invoke/api';
import {FormData} from './model';

export interface IEditFormApi {

  load(options: {id: number}): Promise<FormData>;

  save(options: FormData): Promise<any>;
}

export default class EditFormApi extends ApiCaller implements IEditFormApi {

  load(options: {id: number}) {
    return this._post('/api/form/load', options);
  }

  save(options: FormData) {
    return this._post('/api/form/save', options);
  }

}
