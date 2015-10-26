import * as React from 'react';
import * as ReactRouter from 'react-router';
import IInvoke from '../invoke/IInvoke';
import ICache from '../cache/ICache';
import IHTTPClient from '../http/IHTTPClient';

interface IContextProps {
  invoke: IInvoke;
  cache: ICache;
  render: Function;
  httpClient: IHTTPClient;
}

export default class Context extends React.Component<IContextProps, {}> {

  static childContextTypes: React.ValidationMap<any> = {
    cache: React.PropTypes.object.isRequired,
    invoke: React.PropTypes.func.isRequired,
    httpClient: React.PropTypes.object.isRequired,
  }

  getChildContext () {
    return {
      cache     : this.props.cache,
      invoke    : this.props.invoke,
      httpClient: this.props.httpClient,
    };
  }

  render() {
    return this.props.render();
  }

}
