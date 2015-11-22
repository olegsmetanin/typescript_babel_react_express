/// <reference path="../../webclient.d.ts"/>

import {Action, createAction} from 'redux-actions';
import {Dispatch} from 'redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IUser, IAuthState} from './model';
import * as ActionTypes from './actionTypes';
import AuthApi from './api';

const meRequestBegin = createAction(ActionTypes.ME_REQUEST);

const meRequestSuccess = createAction<any>(
  ActionTypes.ME_REQUEST_SUCCESS,
  (data) => data
);

const meRequestFailure = (e: Error) => {
  const action = createAction(ActionTypes.ME_REQUEST_FAILURE, (e:Error) => e)(e);
  action.error = true;
  return action;
}

const requestMe = (httpClient: IHTTPClient) => (dispatch: Dispatch) => {
  console.log(`${new Date().toISOString()} me request begin`)
  dispatch(meRequestBegin());
  const api = new AuthApi({httpClient});
  return api.me().then(
    result => dispatch(meRequestSuccess(result)),
    error => dispatch(meRequestFailure(error))
  ).then(() => console.log(`${new Date().toISOString()} me request finished`));
}

export {
  requestMe
}
