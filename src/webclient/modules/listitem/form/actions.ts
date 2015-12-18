import {Action} from 'redux-actions';
import {IValidator, ValidationResult} from '../../../../framework/client/validation/IValidator';
import {LISTFORM_LOAD, LISTFORM_EDIT, LISTFORM_SAVE, LISTFORM_VALIDATE} from './actionTypes';
import {IFormApi} from './api';
import {IListItem} from '../../../../common/model';

function factory(options: {api: IFormApi, validator: IValidator}) {

  const loadForm = (id: number) => {
    return {
      type: LISTFORM_LOAD,
      payload: {
        promise: options.api.get({id})
      }
    }
  };

  const saveForm = (form: IListItem): Action => {
    const vr = options.validator.validate(form);
    if (!vr.valid) {
      //form has validation errors
      return {
        type: LISTFORM_VALIDATE,
        payload: vr.errors
      }
    }

    //run saving via api
    return {
      type: LISTFORM_SAVE,
      payload: {
        promise: options.api.update(form),
        data: form
      }
    };
  };

  const editForm = () => {
    return {
      type: LISTFORM_EDIT
    }
  };

  return {
    loadForm,
    saveForm,
    editForm,
  };
}

export default factory;
