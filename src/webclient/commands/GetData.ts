import IHTTPClient from '../../framework/common/http/IHTTPClient';
import JSONPost from '../../framework/common/commands/JSONPost';


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
