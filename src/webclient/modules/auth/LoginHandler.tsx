import * as React from 'react';
var ReactRouter = require('react-router');
const { History } = ReactRouter;
var DocumentMeta = require('react-document-meta');
import OAuthPopup from './components/OAuthPopup';
import {connect} from 'react-redux';
import {IAuthState} from './../auth/model';

interface ILoginHandlerContext {
  history: any;
}

interface ILoginHandlerProps {
  state: IAuthState;
}

class LoginHandler extends React.Component<ILoginHandlerProps, {}> {

  context: ILoginHandlerContext;

  static contextTypes: React.ValidationMap<any> = {
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
