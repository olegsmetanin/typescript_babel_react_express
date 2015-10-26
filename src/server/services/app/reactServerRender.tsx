import * as React from 'react';
import * as Router from 'react-router';
import invoke from '../../../framework/server/invoke/invoke';
import Context from '../../../framework/common/react/Context';
import routes from '../../../webclient/routes/index';
import HTTPClient from '../../../framework/server/http/HTTPClient';
import Cache from '../../../framework/common/cache/Cache';

interface IReactServerRender {
  content: string;
  cachedump: any;
}

export default function reactServerRender(url) {
  return new Promise<IReactServerRender>((resolve, reject) => {

    var cache = new Cache();
    var httpClient = new HTTPClient();

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

          await fillCache(state.routes, 'fillCache', state, cache, invoke, httpClient);

           var content = React.renderToString(<Context
            invoke={invoke}
            cache={cache}
            httpClient={httpClient}
            render={() => <Handler />}
            />);

            var cachedump = cache.dump();
            //console.log('cachedump',cachedump);
            resolve({content, cachedump});

    });
  })
}
