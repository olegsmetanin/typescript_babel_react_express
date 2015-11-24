export interface IUser {
  id          : string;
  slug        : string;
  first_name  : string;
  last_name   : string;
  provider    : string;
  picurl      : string;
}

export interface IUserState {
  me   : IUser;
  ui: {
    loading: boolean;
    error? : Error;
  }
}

export interface IAuthState {
  auth   : IUserState;
}
