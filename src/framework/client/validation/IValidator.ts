export interface IValidator {
  validate(target: any): ValidationResult;
}

declare type ErrorDescription = {code: number, msg: string};

export class ValidationResult {
  valid  : boolean;
  errors : {
    general?: ErrorDescription[];
    [propPath: string]: ErrorDescription[];
  };
}
