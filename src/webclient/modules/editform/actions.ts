import {LOAD_FORM, SAVE_FORM, EDIT_FORM, VALIDATE_FORM} from './actionTypes';
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
        promise: api.save(form),
        data: form
      }
    }
  };

  const editForm = () => {
    return {
      type: EDIT_FORM
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
    editForm,
    validateForm,
  };
}

export default factory;
