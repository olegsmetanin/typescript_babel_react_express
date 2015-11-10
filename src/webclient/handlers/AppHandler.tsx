import * as React from 'react';
var ReactRouter = require('react-router');
const { Link } = ReactRouter;
import Layout from '../components/Layout';
import Popup from '../components/Popup';
import OAuthPopup from '../components/OAuthPopup';
var DocumentMeta = require('react-document-meta');

interface IAppHandlerProps extends React.Props<any> {
}

export default class AppHandler extends React.Component<IAppHandlerProps, {}> {

  static async fillCache(cache) {
    //console.log('AppHandler fillCache');
  }

  context: {
    // router: ReactRouter.Context;
    cache: any;
  }

  static contextTypes: React.ValidationMap<any> = {
    cache: React.PropTypes.object.isRequired,
    //router: React.PropTypes.func.isRequired
  }

  render() {
    return <Layout>
      <Popup />
      <DocumentMeta
        title={'React-blog'}
      />
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/catch">Catch server error</Link>
      <div>
        <OAuthPopup type='facebook'>
          facebook oauth
        </OAuthPopup>
      </div>
      {this.props.children}
    </Layout>;
  }

}
