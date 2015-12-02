import ApiCaller from '../../../framework/client/invoke/api';
import {IUser} from './../../../common/model';

export interface IAuthApi {

  me(): Promise<IUser>;

  login(): Promise<void>;

  logout(): Promise<void>;
}

export default class AuthApi extends ApiCaller implements IAuthApi {

  me() {
    return this._post('/api/me', null);
  }

  login() {
    return this._post('/api/login', null);
  }

  logout() {
    return this._post('/api/logout', null);
  }

}
