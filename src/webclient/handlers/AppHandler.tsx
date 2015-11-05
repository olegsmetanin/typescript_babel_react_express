import * as React from 'react';
import { RouteHandler, State, Link } from 'react-router';
import Layout from '../components/Layout';
var DocumentMeta = require('react-document-meta');

interface IAppHandlerProps {
}

export default class AppHandler extends React.Component<IAppHandlerProps, {}> {

  static async fillCache(state, cache) {
    //console.log('AppHandler fillCache');
  }

  context: {
    router: ReactRouter.Context;
    cache: any;
  }

  static contextTypes: React.ValidationMap<any> = {
    cache: React.PropTypes.object.isRequired,
    router: React.PropTypes.func.isRequired
  }

  render() {
    return <Layout>
      <DocumentMeta
        title={'React-blog'}
      />
      <Link to="home">Home</Link>
      <Link to="about">About</Link>
      <Link to="catch">Catch server error</Link>
      <RouteHandler/>
    </Layout>;
  }

}
