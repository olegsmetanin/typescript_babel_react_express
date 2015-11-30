/// <reference path="../../webclient.d.ts"/>

import {Action, createAction} from 'redux-actions';
import {Dispatch} from 'redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IUser, IAuthState} from './model';
import * as ActionTypes from './actionTypes';
import {IAuthApi} from './api';

function factory(options: {api: IAuthApi}) {

  const {api} = options;

  const requestMe = () => {
    return {
      type: ActionTypes.ME_REQUEST,
      payload: {
        promise: api.me()
      }
    };
  }

  const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST,
      payload: {
        promise: api.logout()
      }
    }
  }

  return {
    requestMe,
    requestLogout,
  };

}

export default factory;
