import Command from '../command/Command';
import IHTTPClient from '../http/IHTTPClient';

interface IJSONPostOptions {
  data?: any;
  httpClient: IHTTPClient;
  url: string;
}

export default class JSONPost extends Command<Promise<any>> {

  className = 'JSONPost';

  options: IJSONPostOptions;

  constructor(options: IJSONPostOptions) {
    super();
    this.options = options;
  }

  execute() {
    return this.options.httpClient.send({
      method: 'post',
      url: this.options.url,
      data: this.options.data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

}
