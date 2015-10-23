/// <reference path="webclient.d.ts"/>
import * as React from 'react';
import Layout from './components/Layout'

window['app'] = (options) => {
  var {el, state} = options || {};
  React.render(<Layout/>, el);
}
