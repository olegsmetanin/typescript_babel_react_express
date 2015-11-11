import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import Layout from '../components/Layout';
import Popup from '../components/Popup';
import OAuthPopup from '../components/OAuthPopup';
const DocumentMeta = require('react-document-meta');

export default class AppHandler extends React.Component<React.Props<any>, {}> {

  render() {
    return (
      <Layout>
        <Popup />
        <DocumentMeta title={'React-blog'} />

        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/catch">Catch server error</Link>
        <br/>
        <Link to="/tasks">Master-details example</Link>
        <br/>

        <div>
          <OAuthPopup type='facebook'>
            facebook oauth
          </OAuthPopup>
        </div>

        {this.props.children}
    </Layout>
    )
  }

}
