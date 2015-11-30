/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import {IUserState} from './../auth/model';
import OAuthPopup from './../auth/components/OAuthPopup';
var LogoIcon = require('./icons/logo.svg');
var MenuIcon = require('./icons/menu.svg');
var LoginIcon = require('./icons/login.svg');
var LodingIcon = require('./icons/loading.svg');
var LogoutIcon = require('./icons/logout.svg');
var BackIcon = require('./icons/back.svg');
var CartIcon = require('./icons/cart.svg');
var NotifyIcon = require('./icons/notify.svg');
var CardIcon = require('./icons/card.svg');

interface IMenuProps {
  auth: IUserState;
  onLogout: () => void;
  onGoBack: () => void;
}

export default class Menu extends React.Component<IMenuProps, {}> {

  render() {
    let {auth} = this.props;
    let {me, ui} = auth;
    return (
      <div className="menu">
        {/*<div className="logo">
          {LogoIcon}
        </div>
        */}
        <ul className="navbar-nav navbar-nav-left">
          <li>
            <Link to="/">{MenuIcon}</Link>
          </li>
          <li>
            <a href="/goback" onClick={(e) => { e.preventDefault(); this.props.onGoBack();}}>{BackIcon}</a>
          </li>
          </ul>
        <ul className="navbar-nav navbar-nav-right">
          <li>
            <Link to="notimplemented">{NotifyIcon}<span className="badge">9+</span></Link>
          </li>
          <li>
            <Link to="notimplemented">{CardIcon}<span className="badge">123k</span></Link>
          </li>
          <li>
            <Link to="notimplemented">{CartIcon}<span className="badge">9+</span></Link>
          </li>
          <li>
            {(me && !!me.id)
              ? <Link to="/notimplemented">
                  <div className="username visible-sm">{me.first_name + ' ' + me.last_name}</div>
                  <img className="userpic" src={me.picurl}/>
                </Link>
              : !ui.loading
                ? <Link to="/login">
                    {LoginIcon}
                  </Link>
                : <div>{LodingIcon}</div>
            }
          </li>
          {(me && !!me.id)
            ? <li>
                <a href="/logout" onClick={(e) => {e.preventDefault(); this.props.onLogout()}}>
                  {LogoutIcon}
                </a>
              </li>
            : null
          }
        </ul>
      </div>
    )
  }

}
