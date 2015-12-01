import {IUser} from './../../../common/model';

export interface IUserState {
  me: IUser;
  ui: {
    loading: boolean;
    error? : Error;
  }
}
