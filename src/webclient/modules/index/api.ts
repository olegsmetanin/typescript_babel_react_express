import ApiCaller from '../../../framework/client/invoke/api';

export interface IIndexApi {

  echo(options: {a: string}): Promise<void>;

}

export default class IndexApi extends ApiCaller implements IIndexApi {

  echo(options: {a: string}) {
    return this._post('/api/echo', options);
  }

}
