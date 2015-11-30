/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import {IUserState} from './../auth/model';
import OAuthPopup from './../auth/components/OAuthPopup';
var LogoIcon = require('./icons/logo.svg');
var MenuIcon = require('./icons/menu.svg');
var LoginIcon = require('./icons/login.svg');
var LoadingIcon = require('./icons/loading.svg');
var LogoutIcon = require('./icons/logout.svg');
var BackIcon = require('./icons/back.svg');
var CartIcon = require('./icons/cart.svg');
var NotifyIcon = require('./icons/notify.svg');
var CardIcon = require('./icons/card.svg');
var CurrencyRubIcon = require('./icons/currency-rub.svg');
var FBIcon = require('./icons/fb.svg');

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
        <div className="logo visible-md">
          {LogoIcon}
        </div>
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
            <Link to="notimplemented">{CartIcon}<span className="badge">9+</span></Link>
          </li>
          <li>
            <Link to="notimplemented"><span className="currency">{CurrencyRubIcon}</span><span className="account">123.00</span></Link>
          </li>

          <li>
            {(me && !!me.id)
              ? <Link to="/notimplemented">
                  {me.provider == 'fb'
                    ? <span className="provider">{FBIcon}</span>
                    : null
                  }
                  <img className="userpic" src={me.picurl}/>
                  {/*<div className="username visible-sm">{me.first_name + ' ' + me.last_name}</div>
                  */}
                </Link>
              : !ui.loading
                ? <Link to="/login">
                    {LoginIcon}
                  </Link>
                : <div>{LoadingIcon}</div>
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
