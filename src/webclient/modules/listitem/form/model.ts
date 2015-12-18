import {IListItem} from '../../../../common/model';//TODO not working, why? '../model'

export interface IFormState {
  item  : IListItem;

  ui: {
    editMode : boolean;
    loading  : boolean;
    saving   : boolean;
    errors?  : Error;
  }
}
