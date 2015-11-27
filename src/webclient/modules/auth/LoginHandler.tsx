import * as React from 'react';
var ReactRouter = require('react-router');
const { Link, History } = ReactRouter;
import GetData from '../../commands/GetData';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import IInvoke from '../../../framework/common/invoke/IInvoke';
var DocumentMeta = require('react-document-meta');
import OAuthPopup from './components/OAuthPopup';
import {connect} from 'react-redux';
import {IUser, IAuthState} from './../auth/model';

interface ILoginHandlerContext {
  httpClient: IHTTPClient;
  invoke: IInvoke;
  cache: any;
  history: any;
}

interface ILoginHandlerProps {
  state: IAuthState;
}

class LoginHandler extends React.Component<ILoginHandlerProps, {}> {

  context: ILoginHandlerContext;

  static contextTypes: React.ValidationMap<any> = {
    httpClient: React.PropTypes.object.isRequired,
    invoke: React.PropTypes.func.isRequired,
    cache: React.PropTypes.object.isRequired,
    history: React.PropTypes.object.isRequired
  }

componentWillReceiveProps(next: ILoginHandlerProps) {
  const {state:{auth:{me}}} = next;
  if (me) {
    this.context.history.pushState(null, '/');
  }
}

  render() {

    return <div>
      <DocumentMeta
        title={'React-blog: Login'}
      />

      <ul>
        <li>
          <OAuthPopup type='facebook'>
            Login with facebook
          </OAuthPopup>
        </li>
      </ul>
    </div>;
  }

}

const mapStateToProps = state => ({
  state: state.modules && state.modules.auth
});

export default connect(mapStateToProps)(LoginHandler);
