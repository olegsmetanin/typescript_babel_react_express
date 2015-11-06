import IHTTPClient, {IHTTPRequest} from '../../common/http/IHTTPClient';
import IEventBus from '../../common/event/IEventBus';
import {ConnectionBrokenError, AuthenticationRequiredError} from './Errors';
import AuthRequired from '../events/AuthRequired';
import ConnectionBrokenEvent from '../events/ConnectionBroken'
import AuthRequiredEvent from "../events/AuthRequired";
import BufferDropEvent from "../events/BufferDrop";
import BufferRetryEvent from "../events/BufferRetry";

interface IHTTPBufferOptions {
  httpClient : IHTTPClient,
  eventBus   : IEventBus,
}

/**
 * Store request data and resulting promise management methods
 * for resend failed http calls
 */
class RequestAttempt {
  constructor(public request: IHTTPRequest, public resolve: (value?: any) => void, public reject: (error?: any) => void) { }
}

/**
 * Implement wrapper around http client, that catch http calls,
 * failed within some issues, and try to resend calls after
 * issues resolved
 */
export default class HTTPBuffer implements IHTTPClient {

  constructor(options: IHTTPBufferOptions) {
    this.options = options;
    this._buffer = [];

    const {eventBus} = this.options;
    eventBus.on(BufferRetryEvent.type, () => this._retry());
    eventBus.on(BufferDropEvent.type, (e) => this._reject(e.data));
  }

  options: IHTTPBufferOptions;

  /**
   * Http calls, planned for resend
   */
  private _buffer: RequestAttempt[];

  send(request: IHTTPRequest): Promise<any> {
    const {httpClient, eventBus} = this.options;

    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.send(request);
        resolve(result);
      } catch(e) {
        if (e instanceof ConnectionBrokenError || e instanceof AuthenticationRequiredError) {
          this._buffer.push({request, resolve, reject});
          this._tryEmit(e);

          return;
        }

        reject(e);
      }
    });
  }

  private _retry() {
    const {httpClient} = this.options;
    for(let i = 0; i < this._buffer.length; ++i) {
      const req = this._buffer[i];
      httpClient.send(req.request)
        .then(result => {
          req.resolve(result);
          const index = this._buffer.indexOf(req);
          if (index >= 0) this._buffer.splice(index, 1);
        }, e => {
            this._tryEmit(e);
          }
        );
    }
  }

  private _reject(reason: string = 'Unknown reason') {
    for(let i = 0; i < this._buffer.length; ++i) {
      this._buffer[i].reject(reason);
    }
    this._buffer = [];
  }

  private _tryEmit(e) {
    const {eventBus} = this.options;

    if (e instanceof ConnectionBrokenError) {
      eventBus.emit(new ConnectionBrokenEvent());
    } else if (e instanceof AuthenticationRequiredError) {
      eventBus.emit(new AuthRequiredEvent());
    }
  }

}
