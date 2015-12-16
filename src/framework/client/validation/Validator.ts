var jsonschema = require('jsonschema');
import {IValidator, ValidationResult} from './IValidator';

/**
 * TODO mapping validation errors to errors hash
 * TODO split fields errors & general errors
 */
export default class Validator implements IValidator {

  private schema: any;
  private validator: any;

  constructor(schema: any) {
    if (schema) {
      this.schema = schema;
    }

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

    return {
      valid  : !result.errors || result.errors.length <= 0,
      errors : (result.errors || []).reduce((acc, next) => {
        if (next.property === 'instance') {
          acc['general'] = acc.general || [];
          acc.general.push({code: 0, msg: next.message});
        } else {

          acc[next.property] = acc[next.property] || [];
          acc[next.property].push({code: 0, msg: next.message});
        }

        return acc;
      }, {}),
    };
  }

}
