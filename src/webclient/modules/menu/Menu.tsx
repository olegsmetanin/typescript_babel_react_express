/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import OAuthPopup from './../auth/components/OAuthPopup';
import {bindActionCreators, Store, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {IUser, IAuthState} from './../auth/model';
import * as MeActions from './../auth/actions';
import IHTTPClient from "../../../framework/common/http/IHTTPClient";
//import UserMenuItem from './components/UserMenuItem';

interface IMenuContext {
}

interface IMenuProps {
  me: IUser;
}

interface IMenuState {
}

export default class Menu extends React.Component<IMenuProps, IMenuState> {

  context: IMenuContext;

  constructor(props, context) {
    super(props, context);
  }

  state: IMenuState = {
  }

  // componentWillMount() {
  //   if (typeof window !== 'undefined') {
  //     console.log(`${new Date().toISOString()} dispatching action requestMe`);
  //     this.state.actions.requestMe(this.context.httpClient);
  //     console.log(`${new Date().toISOString()} dispatched action requestMe`);
  //   }
  // }

  render() {
    let me = this.props.me;
    return (
      <div>


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

        {JSON.stringify(me)}
      </div>
    )
  }

}

// const mapStateToProps = state => ({
//   state: state.modules && state.modules.me
// });
//
// export default connect(mapStateToProps)(Menu);
