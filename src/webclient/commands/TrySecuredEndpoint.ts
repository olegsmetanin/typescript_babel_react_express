import IHTTPClient from '../../framework/common/http/IHTTPClient';
import JSONPost from '../../framework/common/commands/JSONPost';

interface ITrySecuredEndpointOptions {
  httpClient: IHTTPClient;
}

export default class TrySecuredEndpoint extends JSONPost {

  className = 'TrySecuredEndpoint';

  constructor(options: ITrySecuredEndpointOptions) {
    super({
      httpClient: options.httpClient,
      url: '/api/authonly',
    });
  }

}
