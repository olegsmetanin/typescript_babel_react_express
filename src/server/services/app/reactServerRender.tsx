import * as React from 'react';
import * as Router from 'react-router';
import invoke from '../../../framework/server/invoke/invoke';
import Context from '../../../framework/common/react/Context';
import routes from '../../../webclient/routes/index';
import HTTPClient from '../../../framework/server/http/HTTPClient';
import Cache from '../../../framework/common/cache/Cache';
import EventBus from "../../../framework/common/event/EventBus";
var DocumentMeta = require('react-document-meta');

interface IReactServerRender {
  content: string;
  head: string;
  cachedump: any;
  status: number;
}

export default function reactServerRender(url, siteroot: string) {
  return new Promise<IReactServerRender>((resolve, reject) => {

    const cache = new Cache();
    const httpClient = new HTTPClient(siteroot);
    const eventBus = new EventBus({});

    const reactRouter = Router.create({
      location: url,
      routes: routes
    });

    reactRouter.run(async (Handler, state) => {

      async function fillCache(routes, methodName, ...args) {
          return Promise.all(routes
              .map(route => route.handler[methodName])
              .filter(method => typeof method === 'function')
              .map(method => method(...args))
          );
      }

      try {
        await fillCache(state.routes, 'fillCache', state, cache, invoke, httpClient);

        let content = React.renderToString(<Context
          invoke={invoke}
          cache={cache}
          httpClient={httpClient}
          eventBus={eventBus}
          render={() => <Handler />}
        />);

        let head = DocumentMeta.renderAsHTML();

        let cachedump = cache.dump();

        let isNotFound = state.routes.some(route => {
          var r: any = route;
          return r.isNotFound;
        });

        resolve({content, head, cachedump, status: isNotFound ? 404 : 200});
      } catch (e) {
        reject(e);
      }

    });
  })
}
