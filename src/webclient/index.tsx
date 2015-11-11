/// <reference path="webclient.d.ts"/>
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//waiting for actual d.ts
const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
import {
  Store,
  compose,
  createStore,
  bindActionCreators,
  combineReducers
} from 'redux';
import {
  connect,
  Provider
} from 'react-redux';
import { Action } from 'redux-actions';

import routes from './routes/index';
import Context from '../framework/common/react/Context';
import invoke from '../framework/client/invoke/invoke';
import HTTPClient from '../framework/client/http/HTTPClient';
import HTTPBuffer from '../framework/client/http/HTTPBuffer';
import Cache from '../framework/common/cache/Cache';
import EventBus from '../framework/common/event/EventBus';
import {FailedToConnectEvent} from '../framework/common/events/Events';

window['app'] = (options: any) => {
  const {el, cachedump} = options;
  const cache = new Cache();
  cache.load(cachedump);
  const eventBus = new EventBus({});

  eventBus.on<FailedToConnectEvent>(FailedToConnectEvent.type, (evt) => {
    console.log('FailedToConnectEvent: ', evt);
  });

  const httpClient = new HTTPClient({});
  const httpBuffer = new HTTPBuffer({httpClient, eventBus});

  const createBrowserHistory = require('history/lib/createBrowserHistory');
  const useScroll = require('scroll-behavior/lib/useStandardScroll');
  const history = useScroll(createBrowserHistory)();
  ReactDOM.render(<Context
    invoke={invoke}
    cache={cache}
    httpClient={httpBuffer}
    eventBus={eventBus}
    render={() => <Router history={history}>{routes}</Router>}
    />,
    el
  );

}
