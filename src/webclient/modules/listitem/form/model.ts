import {IListItem} from '../../../../common/model';//TODO not working, why? '../model'

export interface IListState {
  item  : IListItem;

  ui: {
    editMode : boolean;
    loading  : boolean;
    saving   : boolean;
    errors?  : Error;
  }
}
