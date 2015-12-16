import {Action} from 'redux-actions';
import {IValidator, ValidationResult} from '../../../framework/client/validation/IValidator';
import {LOAD_FORM, SAVE_FORM, EDIT_FORM, VALIDATE_FORM} from './actionTypes';
import {IEditFormApi} from './api';
import {FormData} from './model';

function factory(options: {api: IEditFormApi, validator: IValidator}) {

  const {api} = options;

  const loadForm = (id: number) => {
    return {
      type: LOAD_FORM,
      payload: {
        promise: api.load({id})
      }
    }
  };

  const saveForm = (form: FormData): Action => {
    const vr = options.validator.validate(form);
    if (!vr.valid) {
      //form has validation errors
      return {
        type: VALIDATE_FORM,
        payload: vr.errors
      }
    }

    //run saving via api
    return {
      type: SAVE_FORM,
      payload: {
        promise: api.save(form),
        data: form
      }
    };
  };

  const editForm = () => {
    return {
      type: EDIT_FORM
    }
  };

  return {
    loadForm,
    saveForm,
    editForm,
  };
}

export default factory;
