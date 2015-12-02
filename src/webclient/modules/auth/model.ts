import {IUser} from './../../../common/model';

export interface IPopupState {
  open     : boolean;
  auth     : boolean;
  reconnect: boolean;
  errors?  : any;
}

export interface IUserState {
  me: IUser;
  ui: {
    loading: boolean;
    error? : Error;
  },
  popup: IPopupState
}
