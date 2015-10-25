import IHTTPClient from '../../framework/server/interfaces/IHTTPClient';
import JSONPost from '../../framework/server/commands/JSONPost';


interface IGetDataOptions {
  data: any;
  httpClient: IHTTPClient;
  siteroot?: string;
}

export default class GetData extends JSONPost {

  className = 'GetData';

  constructor(options: IGetDataOptions) {
    super({
      data: options.data,
      httpClient: options.httpClient,
      url: (options.siteroot ? options.siteroot : '') + '/api/data'
    });
  }

}
