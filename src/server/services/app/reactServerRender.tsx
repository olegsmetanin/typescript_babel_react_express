import * as React from 'react';
import { renderToString } from 'react-dom/server';
var ReactRouter = require('react-router');
var { match, RoutingContext } = ReactRouter;
import invoke from '../../../framework/server/invoke/invoke';
import Context from '../../../framework/common/react/Context';
import routes from '../../../webclient/routes/index';
import HTTPClient from '../../../framework/server/http/HTTPClient';
import Cache from '../../../framework/common/cache/Cache';
import EventBus from "../../../framework/common/event/EventBus";
import HTMLStab from './HTMLStab';
var DocumentMeta = require('react-document-meta');

interface IReactServerRender {
  content: string;
  head: string;
  cachedump: any;
  status: number;
}

export default async function reactServerRender(url, siteroot: string, req, res) {

    const cache = new Cache();
    const httpClient = new HTTPClient(siteroot);
    const eventBus = new EventBus({});

      // Filling cache from static method is broken
      //console.log('routes', routes)

      // async function fillCache(routes, methodName, ...args) {
      //     return Promise.all(routes
      //         .map(route => route.handler[methodName])
      //         .filter(method => typeof method === 'function')
      //         .map(method => method(...args))
      //     );
      // }
      //
      //   await fillCache(createRoutes(routes), 'fillCache', cache, invoke, httpClient);

      match({ routes, location: url }, (error, redirectLocation, renderProps) => {
        if (error) {
          res.status(500).send(error.message)
        } else if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {

          let content = renderToString(<Context
            invoke={invoke}
            cache={cache}
            httpClient={httpClient}
            eventBus={eventBus}
            render={() => <RoutingContext {...renderProps} />}
          />);

          let head = DocumentMeta.renderAsHTML();

          let cachedump = cache.dump();

          res.status(200).send(HTMLStab({content, head, cachedump}))
        } else {
          res.status(404).send(HTMLStab({content:'Not found', head: 'Not found', cachedump: []}))
        }
      })
}
