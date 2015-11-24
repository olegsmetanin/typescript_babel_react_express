/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import OAuthPopup from './../auth/components/OAuthPopup';
import {bindActionCreators, Store, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {IUser, IUserState} from './../auth/model';
import * as MeActions from './../auth/actions';
import IHTTPClient from "../../../framework/common/http/IHTTPClient";
import UserMenuItem from './components/UserMenuItem';

interface IMenuContext {
}

interface IMenuProps {
  auth: IUserState;
  onLogout: () => void;
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

  render() {

    let {auth} = this.props;

    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/catch">Catch server error</Link>
        <br/>
        <Link to="/tasks">Master-details example</Link>
        <div>
          <UserMenuItem
            auth={auth}
            onLogout={this.props.onLogout}
          />
        </div>
      </div>
    )
  }

}
