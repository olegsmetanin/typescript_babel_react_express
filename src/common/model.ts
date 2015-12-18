export interface IUser {
  id          : string;
  slug        : string;
  first_name  : string;
  last_name   : string;
  provider    : string;
  picurl      : string;
}

export interface IListItem {
  id          : number;
  name        : string;
  description : string;
  validTill   : string;
  typeCode    : string;
  enabled     : boolean;
}
