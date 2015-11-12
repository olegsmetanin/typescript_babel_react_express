/// <reference path="../webclient.d.ts"/>
import * as React from 'react';
var ReactRouter = require('react-router');
var { IndexRoute, Route } = ReactRouter;
import AppHandler from '../handlers/AppHandler';
import IndexHandler from '../handlers/IndexHandler';
import AboutHandler from '../handlers/AboutHandler';
import CatchHandler from '../handlers/CatchHandler';
import NotFoundHandler from '../handlers/NotFoundHandler';
import TasksHandler from '../modules/tasks/TasksHandler';

let routes = <Route>
  <Route path="/" component={AppHandler}>
    <IndexRoute component={IndexHandler}/>
    <Route path="about" component={AboutHandler} />
    <Route path="catch" component={CatchHandler} />
    <Route path="tasks" component={TasksHandler} />
  </Route>
  <Route path="*" component={NotFoundHandler} />
</Route>

export default routes;
