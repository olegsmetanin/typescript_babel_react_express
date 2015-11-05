/// <reference path="webclient.d.ts"/>
import * as React from 'react';
import * as Router from 'react-router';
//import Layout from './components/Layout'
import routes from './routes/index';
import Context from '../framework/common/react/Context';
import invoke from '../framework/client/invoke/invoke';
import HTTPClient from '../framework/client/http/HTTPClient';
import Cache from '../framework/common/cache/Cache';
import EventBus from '../framework/common/event/EventBus';
import {FailedToConnectEvent} from '../framework/common/events/Events';

window['app'] = (options: any) => {
  var {el, cachedump} = options;
  var cache = new Cache();;
  cache.load(cachedump);
  var eventBus = new EventBus({});

  eventBus.on<FailedToConnectEvent>(FailedToConnectEvent.type, (evt) => {
    console.log('FailedToConnectEvent: ', evt);
  })

  var httpClient = new HTTPClient({eventBus});

    let render = (Handler, state) => {

      async function run() {

        React.render(<Context
          invoke={invoke}
          cache={cache}
          httpClient={httpClient}
          render={() => <Handler />}
          />,
          el
        );
      }

      run().catch(error => {
        console.log('React.render error', error);
        throw error; //hmm, in callback? wtf?
      });

    }

    Router.run(
      routes,
      Router.HistoryLocation,
      render
    );


}
