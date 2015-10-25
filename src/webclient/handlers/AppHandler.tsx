import * as React from 'react';
import { RouteHandler, State, Link } from 'react-router';
import Layout from '../components/Layout';

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
      <Link to="home">Home</Link>
      <Link to="about">About</Link>
      <RouteHandler/>
    </Layout>;
  }

}
