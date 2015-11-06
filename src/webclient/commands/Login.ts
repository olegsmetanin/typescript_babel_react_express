import IHTTPClient from '../../framework/common/http/IHTTPClient';
import JSONPost from '../../framework/common/commands/JSONPost';

interface ILoginOptions {
  httpClient: IHTTPClient;
}

export default class Login extends JSONPost {

  className = 'Login';

  constructor(options: ILoginOptions) {
    super({
      httpClient: options.httpClient,
      url: '/api/login',
    });
  }

}
