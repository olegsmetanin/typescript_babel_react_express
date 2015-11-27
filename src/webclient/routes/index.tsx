/// <reference path="../webclient.d.ts"/>
import * as React from 'react';
var ReactRouter = require('react-router');
var { IndexRoute, Route } = ReactRouter;
import Layout from '../modules/layout/Layout';
import IndexHandler from '../modules/index/IndexHandler';
import LoginHandler from '../modules/auth/LoginHandler';
//import AboutHandler from '../handlers/AboutHandler';
import CatchHandler from '../handlers/CatchHandler';
import NotFoundHandler from '../handlers/NotFoundHandler';
//import TasksHandler from '../modules/tasks/TasksHandler';

const loadContainerAsync = bundle => (location, cb) => {
  if (typeof window !== 'undefined') {
    bundle(component => {
      cb(null, component);
    });
  } else {
    cb(null, bundle);
  }
};

let routes = <Route>
  <Route path="/" component={Layout}>
    <IndexRoute component={IndexHandler}/>
    <Route path="login" component={LoginHandler} />
    <Route path="about" getComponent={loadContainerAsync(require('bundle?lazy&name=about!../handlers/AboutHandler'))} />
    <Route path="catch" component={CatchHandler} />
    <Route path="tasks" getComponent={loadContainerAsync(require('bundle?lazy&name=tasks!../modules/tasks/TasksHandler'))}  />
  </Route>
  <Route path="*" component={NotFoundHandler} />
</Route>

export default routes;
