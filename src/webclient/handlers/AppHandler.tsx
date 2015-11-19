import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import Layout from '../components/Layout';
import Popup from '../components/Popup';
import OAuthPopup from '../components/OAuthPopup';
const DocumentMeta = require('react-document-meta');

interface IAppHandlerState {
  clientWidth : number;
}

export default class AppHandler extends React.Component<React.Props<any>, IAppHandlerState> {

  constructor(props) {
    super(props);
    this.state = {clientWidth: 400};
  }

  handleResize(e) {
    if (document) {
      this.setState({clientWidth: document.getElementById('app').clientWidth});
    }
  }

  componentDidMount() {
    this.handleResize(null);
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  render() {
    var w = this.state.clientWidth;
    let xstyle = w < 401
      ? 'xxs'
      : w < 768
        ? 'xs'
        : w < 991
          ? 'sm'
          : w < 1299
            ? 'md'
            : 'lg';

    return (
      <div className={xstyle}>
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
      </div>
    )
  }

}
