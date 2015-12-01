import * as React from 'react';
var ReactRouter = require('react-router');
var DocumentMeta = require('react-document-meta');
import OAuthPopup from './components/OAuthPopup';
import {connect} from 'react-redux';
import {IUser} from '../../../common/model';

interface ILoginHandlerContext {
  history: any;
}

interface ILoginHandlerProps {
  me: IUser;
}

class LoginHandler extends React.Component<ILoginHandlerProps, {}> {

  context: ILoginHandlerContext;

  static contextTypes: React.ValidationMap<any> = {
    history: React.PropTypes.object.isRequired
  }

componentWillReceiveProps(next: ILoginHandlerProps) {
  const {me} = next;
  if (me && me.id) {
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
  me: state.modules && state.modules.auth && state.modules.auth.me
});

export default connect(mapStateToProps)(LoginHandler);
