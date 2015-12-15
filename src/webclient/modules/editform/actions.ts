import {LOAD_FORM, SAVE_FORM, UPDATE_FORM, VALIDATE_FORM} from './actionTypes';
import {IEditFormApi} from './api';
import {FormData} from './model';

function factory(options: {api: IEditFormApi}) {

  const {api} = options;

  const loadForm = (id: number) => {
    return {
      type: LOAD_FORM,
      payload: {
        promise: api.load({id})
      }
    }
  };

  const saveForm = (form: FormData) => {
    return {
      type: SAVE_FORM,
      payload: {
        promise: api.save(form)
      }
    }
  };

  const updateForm = (form: FormData) => {
    return {
      type: UPDATE_FORM,
      payload: form
    }
  };

  const validateForm = (errors: any[]) => {
    return {
      type: VALIDATE_FORM,
      payload: errors
    }
  };

  return {
    loadForm,
    saveForm,
    updateForm,
    validateForm,
  };
}

export default factory;
