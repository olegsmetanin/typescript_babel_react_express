var jsonschema = require('jsonschema');
import {IValidator, ValidationResult} from './IValidator';

/**
 * TODO mapping validation errors to errors hash
 * TODO split fields errors & general errors
 */
export default class Validator implements IValidator {

  private schema: any;
  private msgs: any;
  private validator: any;

  constructor(schema: any, msgs: any) {
    this.schema = schema;
    this.msgs = msgs;

    var Validator = jsonschema.Validator;
    this.validator = new Validator();
    this.validator.addSchema(this.schema, '/root');

    const importNextSchema = () => {
      let nextSchema = this.validator.unresolvedRefs.shift();
      if (!nextSchema) {
        return;
      }
      this.validator.addSchema(require('../../../common/api' + nextSchema), nextSchema);
      importNextSchema();
    };
    importNextSchema();
  }

  validate(target: any): ValidationResult {
    const result = this.validator.validate(target, this.schema);
//console.log(result);
    return {
      valid  : !result.errors || result.errors.length <= 0,
      errors : (result.errors || []).reduce((acc, next) => {
        if (next.property === 'instance') {
          acc['general'] = acc.general || [];
          acc.general.push({code: 0, msg: this._msgFor(next), tmp: next});
        } else {
          acc[next.property] = acc[next.property] || [];
          acc[next.property].push({code: 0, msg: this._msgFor(next)});
        }

        return acc;
      }, {}),
    };
  }

  _msgFor(validatorError: any) {
    return !this.msgs
      ? validatorError.message
      : !this.msgs[validatorError.property]
        ? (typeof this.msgs[validatorError.name] !== 'undefined' ? this.msgs[validatorError.name] : validatorError.message)
        : this.msgs[validatorError.property][validatorError.name];
  }

}
