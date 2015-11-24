/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import OAuthPopup from './../../auth/components/OAuthPopup';
import {bindActionCreators, Store, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {IUser, IUserState} from './../../auth/model';
import * as MeActions from './../../auth/actions';
import IHTTPClient from "../../../../framework/common/http/IHTTPClient";
//import UserMenuItem from './components/UserMenuItem';

interface IUserMenuItemContext {
}

interface IUserMenuItemProps {
  auth: IUserState;
  onLogout: () => void;
}

interface IUserMenuItemState {
}

export default class UserMenuItem extends React.Component<IUserMenuItemProps, IUserMenuItemState> {

  context: IUserMenuItemContext;

  constructor(props, context) {
    super(props, context);
  }

  state: IUserMenuItemState = {
  }

  render() {

    let {auth:{me, ui}} = this.props;

    return (
      <div>
        {me
          ? <div>
              {/*JSON.stringify(me)*/}
              {me.first_name + ' ' + me.last_name}
              <img src={me.picurl}/>
              <button onClick={() => this.props.onLogout()}>
                Logout
              </button>
            </div>
          : !ui.loading
            ? <div>
                <OAuthPopup type='facebook'>
                  Login with facebook
                </OAuthPopup>
              </div>
            : <div>Loading user</div>
        }
      </div>
    )
  }

}
