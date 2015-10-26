import IHTTPClient from '../../framework/common/http/IHTTPClient';
import JSONPost from '../../framework/common/commands/JSONPost';

interface ICatchServerExceptionOptions {
  counter: number;
  httpClient: IHTTPClient;
}

export default class CatchServerException extends JSONPost {

  className = 'CatchServerException';

  constructor(options: ICatchServerExceptionOptions) {
    super({
      data: {counter: options.counter},
      httpClient: options.httpClient,
      url: '/api/throw',
    });
  }

}
