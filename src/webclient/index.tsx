/// <reference path="webclient.d.ts"/>
import * as React from 'react';
import * as Router from 'react-router';
//import Layout from './components/Layout'
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

  let render = (Handler, state) => {

    async function run() {

      React.render(<Context
        invoke={invoke}
        cache={cache}
        httpClient={httpBuffer}
        eventBus={eventBus}
        render={() => <Handler />}
        />,
        el
      );
    }

    run().catch(error => {
      console.error('React.render error', error);
      return error;
    });

  };

  Router.run(
    routes,
    Router.HistoryLocation,
    render
  );

}
