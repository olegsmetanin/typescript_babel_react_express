export class FormData {
  id          : number;
  name        : string;
  description : string;
  validTill   : string;
  typeCode    : string;
  enabled     : boolean;
}

export interface IModuleState {
  data : FormData;
  ui   : {
    editMode : boolean;
    loading  : boolean;
    saving   : boolean;
    errors?  : Error;
  }
}
