/// <reference path="../../webclient.d.ts"/>

import * as ActionTypes from './actionTypes';
import {IAuthApi} from './api';
import {IPopupState} from './model';

function factory(options: {api: IAuthApi}) {

  const {api} = options;

  const requestMe = () => {
    return {
      type: ActionTypes.ME_REQUEST,
      payload: {
        promise: api.me()
      }
    };
  };

  const requestLogin = () => {
    return {
      type: ActionTypes.LOGIN_REQUEST,
      payload: {
        promise: api.login()
      }
    }
  };

  const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST,
      payload: {
        promise: api.logout()
      }
    }
  };

  const popupModeChange = (state: IPopupState) => {
    return {
      type: ActionTypes.POPUP_MODE_CHANGE,
      payload: state,
    }
  };

  return {
    requestMe,
    requestLogin,
    requestLogout,
    popupModeChange,
  };

}

export default factory;
