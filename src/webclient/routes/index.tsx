/// <reference path="../webclient.d.ts"/>
import * as React from 'react';
var ReactRouter = require('react-router');
var { IndexRoute, Route } = ReactRouter;
import Layout from '../modules/layout/Layout';
import IndexHandler from '../modules/index/IndexHandler';
import LoginHandler from '../modules/auth/LoginHandler';
//import AboutHandler from '../handlers/AboutHandler';
import CatchHandler from '../modules/catch/CatchHandler';
import NotFoundHandler from '../modules/notfound/NotFoundHandler';
//import TasksHandler from '../modules/tasks/TasksHandler';
import NotImplementedHandler from '../modules/notimplemented/NotImplementedHandler';
import PingPongHandler from '../modules/pingpong/PingPongHandler';
import EditFormHandler from '../modules/editform/EditFormHandler';

import ListItemListHandler from '../modules/list/ListItemListHandler';
import ListItemFormHandler from '../modules/list/ListItemFormHandler';

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
    <Route path="about" getComponent={loadContainerAsync(require('bundle?lazy&name=about!../modules/about/AboutHandler'))} />
    <Route path="notimplemented" component={NotImplementedHandler} />
    <Route path="catch" component={CatchHandler} />
    <Route path="tasks" getComponent={loadContainerAsync(require('bundle?lazy&name=tasks!../modules/tasks/TasksHandler'))}  />
    <Route path="pingpong" component={PingPongHandler} />
    <Route path="editform" component={EditFormHandler} />

    <Route path="listform" component={ListItemListHandler}>
      <Route path="/:id" component={ListItemFormHandler} />
    </Route>
  </Route>
  <Route path="*" component={NotFoundHandler} />
</Route>

export default routes;
