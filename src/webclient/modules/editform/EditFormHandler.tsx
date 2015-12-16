/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import Validator from '../../../framework/client/validation/Validator';
import {FormData, IModuleState} from './model';
import actionsFactory from './actions';
import EditFormApi from './api';
import ViewForm from './components/ViewForm';
import EditForm from './components/EditForm';

const formValidationSchema = require('../../../common/api/form/form.json');

interface IContext {
  httpClient: IHTTPClient;
}

interface IProps extends React.Props<EditFormHandler> {
  state    : IModuleState;
  dispatch : Dispatch;
}

class EditFormHandler extends React.Component<IProps, {}> {

  static contextTypes: React.ValidationMap<any> = {
    httpClient: React.PropTypes.object.isRequired,
  };

  static async composeState(dispatch: Dispatch, httpClient: IHTTPClient) {
    const api = new EditFormApi({httpClient});
    const actions = actionsFactory({api, validator: null});
    await dispatch(actions.loadForm(1));//TODO get id from route params
  }

  actions: any;
  context: IContext;

  constructor(props, context) {
    super(props, context);

    const api = new EditFormApi({httpClient: context.httpClient});
    const validator = new Validator(formValidationSchema);
    this.actions = bindActionCreators(actionsFactory({api, validator}), props.dispatch);
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      this.actions.loadForm(1);//TODO get id from route params
    }
  }

  render() {
    const {state: {data, ui}} = this.props;

    const renderLoading = () => {
      return <div>Loading form data...</div>
    };

    const renderErrors = () => {
      return <div style={{color: 'red'}}>{JSON.stringify(ui.errors)}</div>;
    };

    return (
      <div>
        {ui.loading && renderLoading()}
        {ui.errors && renderErrors()}

        {data && (
          !ui.editMode
            ? <ViewForm data={data} onEdit={() => this.actions.editForm()} />
            : <EditForm data={data} saving={ui.saving} onSave={changedData => this.actions.saveForm(changedData)} />
          )
        }

        {!ui.loading && !data && <div>No data to show</div>}
      </div>
    )

  }

}

const mapStateToProps = (state) => ({
  state: state && state.modules && state.modules.editform
});

export default connect(mapStateToProps)(EditFormHandler);
