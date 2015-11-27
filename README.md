# typescript_babel_react_express
typescript+babel+react+express

$ npm install

$ npm run tsd install

$ docker run --name redis -p 6379:6379 -d redis

$ docker run -d --name rabbit --hostname rabbithostname -p 5672:5672 -p 15672:15672 rabbitmq:management

$ docker run --name postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres

$ export NODE_ENV=development

$ gulp

$ npm run migration init

$ gulp webclient

$ gulp server

ps: redux-actions must be patched manually for error reducers may work (bug fixed in repo, but new release not deployed to npm yet)
node_modules\redux-actions\lib\handleActions.js:21
reducers.next = reducers.throw = reducers;
