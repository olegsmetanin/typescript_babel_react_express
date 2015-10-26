/// <reference path="../webclient.d.ts"/>
import * as React from 'react';
import { Route, DefaultRoute, NotFoundRoute } from 'react-router';
import AppHandler from '../handlers/AppHandler';
import IndexHandler from '../handlers/IndexHandler';
import AboutHandler from '../handlers/AboutHandler';
import CatchHandler from '../handlers/CatchHandler';
import NotFoundHandler from '../handlers/NotFoundHandler';


let routes = <Route>
  <Route handler={AppHandler}>
    <DefaultRoute name="home" handler={IndexHandler}/>
    <Route name="about" path="/about" handler={AboutHandler} />
    <Route name="catch" path="/catch" handler={CatchHandler} />
  </Route>
  <NotFoundRoute name="notFound" handler={NotFoundHandler} />
</Route>

export default routes;
