/// <reference path="webclient.d.ts"/>
import * as React from 'react';
import * as Router from 'react-router';
//import Layout from './components/Layout'
import routes from './routes/index';
import Context from '../framework/client/context/Context';
import invoke from './helpers/invoke';
import HTTPClient from '../framework/client/http/HTTPClient';
var LRU = require("lru-cache");

window['app'] = (options: any) => {
  var {el, cachedump} = options || {};
  var cache = LRU({max: 500});
  cache.load(cachedump);
  var httpClient = new HTTPClient();

    let render = (Handler, state) => {

      async function run() {

        async function fillCache(routes, methodName, ...args) {
            return Promise.all(routes
                .map(route => route.handler[methodName])
                .filter(method => typeof method === 'function')
                .map(method => method(...args))
            );
        }

        await fillCache(state.routes, 'fillCache', state, cache, invoke, httpClient);

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
