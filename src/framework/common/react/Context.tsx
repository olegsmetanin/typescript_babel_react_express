import * as React from 'react';
var ReactRouter = require('react-router');
import IInvoke from '../invoke/IInvoke';
import ICache from '../cache/ICache';
import IHTTPClient from '../http/IHTTPClient';
import IEventBus from "../event/IEventBus";

interface IContextProps {
  invoke     : IInvoke;
  cache      : ICache;
  render     : Function;
  httpClient : IHTTPClient;
  eventBus   : IEventBus;
}

export default class Context extends React.Component<IContextProps, {}> {

  static childContextTypes: React.ValidationMap<any> = {
    cache      : React.PropTypes.object.isRequired,
    invoke     : React.PropTypes.func.isRequired,
    httpClient : React.PropTypes.object.isRequired,
    eventBus   : React.PropTypes.object.isRequired,
  }

  getChildContext () {
    return {
      cache      : this.props.cache,
      invoke     : this.props.invoke,
      httpClient : this.props.httpClient,
      eventBus   : this.props.eventBus,
    };
  }

  render() {
    return this.props.render();
  }

}
