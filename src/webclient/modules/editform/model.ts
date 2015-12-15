export class FormData {
  id          : number;
  name        : string;
  description : string;
  validTill   : Date;
  typeCode    : string;
  enabled     : boolean;
}

export interface IModuleState {
  data : FormData;
  ui   : {
    loading : boolean;
    saving  : boolean;
    errors? : Error;
  }
}
