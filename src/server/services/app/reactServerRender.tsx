import * as React from 'react';
import { renderToString } from 'react-dom/server';
var ReactRouter = require('react-router');
var { match, RoutingContext } = ReactRouter;
import {
  Store,
  compose,
  createStore,
  bindActionCreators,
  applyMiddleware,
  combineReducers
} from 'redux';
import {connect, Provider} from 'react-redux';
import { Action } from 'redux-actions';
import thunk from 'redux-thunk';
const promiseMiddleware = require('redux-promise-middleware');

import Context from '../../../framework/common/react/Context';
import routes from '../../../webclient/routes/index';
import {rootReducer as modulesRootReducer} from '../../../webclient/modules/rootReducer';
import HTTPClient from '../../../framework/server/http/HTTPClient';
import Cache from '../../../framework/common/cache/Cache';
import EventBus from "../../../framework/common/event/EventBus";
import HTMLStab from './HTMLStab';
var DocumentMeta = require('react-document-meta');

export default async function reactServerRender(url, siteroot: string, socketPath: string, req, res) {

  const cache = new Cache();
  const httpClient = new HTTPClient(siteroot);
  const eventBus = new EventBus({});

  const initialState: any = {};//TODO typed and dehidrated from server (instead of cache)
  const rootReducer = combineReducers({
    app: (state, action: Action) => ({}),//TODO app-wide state
    modules: modulesRootReducer
  });
  const finalCreateStore = compose(
    applyMiddleware(thunk),
    applyMiddleware(promiseMiddleware({promiseTypeSuffixes: ['BEGIN', 'SUCCESS', 'FAILURE']}))
    //TODO redux-react-router???
  )(createStore);
  const store: Store = finalCreateStore(rootReducer, initialState);

  //preload data for rendering
  async function composeState(routes, methodName, ...args) {
    return Promise.all(routes
      .filter(route => !!route)
      .map(route => route[methodName])
      .filter(method => typeof method === 'function')
      .map(method => method(...args))
    );
  }

  match({ routes, location: url }, async (error, redirectLocation, renderProps) => {

    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      //console.log('renderProps', renderProps);
      //because when NotFoundRoute exists, renderProps will be filled for unknown path's,
      //we test this situation manually
      const isNotFound = renderProps.components.some(route => route && route.isNotFound);

      if (isNotFound) {
        res.status(404).send(HTMLStab({content:'Not found', head: 'Not found', cachedump: []}));
      } else {
        try {
          //renderProps.components contains route handlers itself (first elm always undefined, why?)
          await composeState(renderProps.components, 'composeState', store.dispatch, httpClient);

          let content = renderToString(
            <Provider store={store}>
              <Context
                cache={cache}
                httpClient={httpClient}
                eventBus={eventBus}
                render={() => <RoutingContext {...renderProps} />}
              />
            </Provider>
          );

          let head = DocumentMeta.renderAsHTML();
          let cachedump = cache.dump();
          const state = store.getState();

          res.status(200).send(HTMLStab({content, head, cachedump, state, socketPath}));
        } catch(e) {
          console.log('React render error: ', e);
          res.status(500).send(HTMLStab({content:e.toString(), head: 'Error', socketPath}))
        }
      }
    } else {
      res.status(404).send(HTMLStab({content:'Not found', head: 'Not found', cachedump: [], socketPath}));
    }
  });
}
