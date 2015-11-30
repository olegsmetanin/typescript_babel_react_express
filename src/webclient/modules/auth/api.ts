import ApiCaller from '../../../framework/client/invoke/api';
import {IUser} from './model';

export interface IAuthApi {

  me(): Promise<IUser>;

  logout(): Promise<void>;
}

export default class AuthApi extends ApiCaller implements IAuthApi {

  me() {
    return this._post('/api/me', null);
  }

  logout() {
    return this._post('/api/logout', null);
  }

}
