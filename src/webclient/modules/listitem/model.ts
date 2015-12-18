import {IListState} from './list/model';
import {IFormState} from './form/model';

export interface IModuleState {
  list: IListState;
  form: IFormState;
}

//not work now (18.12.2015)
export {IListItem} from '../../../common/model';
