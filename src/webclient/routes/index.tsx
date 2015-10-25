/// <reference path="../webclient.d.ts"/>
import * as React from 'react';
import { Route, DefaultRoute } from 'react-router';
import AppHandler from '../handlers/AppHandler';
import IndexHandler from '../handlers/IndexHandler';
import AboutHandler from '../handlers/AboutHandler';

let routes =  <Route handler={AppHandler}>
    <DefaultRoute name="home" handler={IndexHandler}/>
    <Route name="about" path="/about" handler={AboutHandler} />
</Route>

export default routes;
