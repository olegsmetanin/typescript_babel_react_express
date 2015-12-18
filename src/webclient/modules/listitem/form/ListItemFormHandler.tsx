/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
import {bindActionCreators, Store, Dispatch} from 'redux';
import {connect} from 'react-redux';
import IHTTPClient from '../../../../framework/common/http/IHTTPClient';
import Validator from '../../../../framework/client/validation/Validator';
import {IListItem} from '../../../../common/model';
import {IFormState} from './model';
import actionsFactory from './actions';
import FormApi from './api';
import ViewForm from './components/ViewForm';
import EditForm from './components/EditForm';

const formValidationSchema = require('../../../../common/api/form/form.json');
const validationMessages = require('./validation_messages.ru');


interface IContext {
  httpClient: IHTTPClient;
}

interface IProps extends React.Props<ListItemFormHandler> {
  state    : IFormState;
  dispatch : Dispatch;
  params   : {id: number}
}


class ListItemFormHandler extends React.Component<IProps, {}> {

  static contextTypes: React.ValidationMap<any> = {
    httpClient: React.PropTypes.object.isRequired,
  };

  static async composeState(dispatch: Dispatch, httpClient: IHTTPClient, props: any) {
    const api = new FormApi({httpClient});
    const actions = actionsFactory({api, validator: null});
    const id = Number(props.params.id);
    await dispatch(actions.loadForm(id));
  }

  actions: any;
  context: IContext;

  constructor(props, context) {
    super(props, context);

    const api = new FormApi({httpClient: context.httpClient});
    const validator = new Validator(formValidationSchema, validationMessages);
    this.actions = bindActionCreators(actionsFactory({api, validator}), props.dispatch);
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      const id = Number(this.props.params.id);
      const {item} = this.props.state;
      if (!item || item.id !== id) {
        this.actions.loadForm(id);
      }
    }
  }

  render() {
    const {state: {item, ui}} = this.props;

    const renderLoading = () => {
      return <div>Loading form data...</div>
    };

    return (
      <div>
        {ui.loading && renderLoading()}

        {item && (
          !ui.editMode
            ? <ViewForm data={item} onEdit={() => this.actions.editForm()} />
            : <EditForm errors={ui.errors} data={item} saving={ui.saving} onSave={changedData => this.actions.saveForm(changedData)} />
          )
        }

        {!ui.loading && !item && <div>No data to show</div>}
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  state: state && state.modules && state.modules.listitem && state.modules.listitem.form
});

export default connect(mapStateToProps)(ListItemFormHandler);
