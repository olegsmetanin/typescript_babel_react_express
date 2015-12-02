import ApiCaller from '../../../framework/client/invoke/api';

export interface ICatchApi {

  throw(counter: number): Promise<void>;

  authonly(): Promise<void>;
}

export default class CatchApi extends ApiCaller implements ICatchApi {

  throw(counter:number) {
    return this._post('/api/throw', {counter});
  }

  authonly() {
    return this._post('/api/authonly', null);
  }

}
