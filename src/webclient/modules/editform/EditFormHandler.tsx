/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {FormData, IModuleState} from './model';
import actionsFactory from './actions';
import EditFormApi from './api';

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
    const actions = actionsFactory({api});
    await dispatch(actions.loadForm(1));//TODO get id from route params
  }

  actions: any;
  context: IContext;

  constructor(props, context) {
    super(props, context);

    const api = new EditFormApi({httpClient: context.httpClient});
    this.actions = bindActionCreators(actionsFactory({api}), props.dispatch);
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      this.actions.loadForm(1);//TODO get id from route params
    }
  }

  save = () => {
    var Validator = require('jsonschema').Validator;
    var v = new Validator();
    var formSchema = require('../../../common/api/form/form.json');
    v.addSchema(formSchema, '/form.json');

    function importNextSchema() {
      var nextSchema = v.unresolvedRefs.shift();
      if (!nextSchema) {
        return;
      }
      v.addSchema(require('../../../common/api' + nextSchema), nextSchema);
      importNextSchema();
    }
    importNextSchema();

    var result = v.validate(this.props.state.data, formSchema);
    if (result.errors.length) {
      console.log('Validation errors!', result);
      this.actions.validateForm(result.errors);
    } else {
      this.actions.saveForm(this.props.state.data);
    }
  };

  update = () => {
    const form = {
      id          : ReactDOM.findDOMNode<HTMLInputElement>(this.refs["id"]).value,
      name        : ReactDOM.findDOMNode<HTMLInputElement>(this.refs["name"]).value,
      description : ReactDOM.findDOMNode<HTMLInputElement>(this.refs["description"]).value,
      validTill   : ReactDOM.findDOMNode<HTMLInputElement>(this.refs["validTill"]).value,
      typeCode    : ReactDOM.findDOMNode<HTMLInputElement>(this.refs["typeCode"]).value,
      enabled     : ReactDOM.findDOMNode<HTMLInputElement>(this.refs["enabled"]).checked
    };
    this.actions.updateForm(form);
  };

  render() {
    const {state: {data, ui}} = this.props;

    const renderLoading = () => {
      return <div>Loading form data...</div>
    };

    const renderSaveButton = () => {
      return <button type="button" disabled={ui.saving} onClick={this.save}>
        {!ui.saving ? 'Save' : 'Saving...'}
      </button>
    };

    const renderForm = () => {
      return (
        <div className="form">
          <div>
            <label>Id:</label>
            <input ref="id" type="text" value={data.id.toString()} onChange={this.update} />
          </div>
          <div>
            <label>Name:</label>
            <input ref="name" type="text" value={data.name} onChange={this.update} />
          </div>
          <div>
            <label>Descriptions:</label>
            <textarea ref="description" value={data.description} rows={3} onChange={this.update} />
          </div>
          <div>
            <label>Valid till:</label>
            <input ref="validTill" type="text" value={data.validTill && data.validTill.toString()} onChange={this.update} />
          </div>
          <div>
            <label>Type code:</label>
            <input ref="typeCode" type="text" value={data.typeCode} onChange={this.update} />
          </div>
          <div>
            <label>Enabled:</label>
            <input ref="enabled" type="checkbox" checked={data.enabled} onChange={this.update} />
          </div>
          <div>
            {renderSaveButton()}
          </div>
        </div>
      )
    };

    const renderErrors = () => {
      return <div style={{color: 'red'}}>{JSON.stringify(ui.errors)}</div>;
    }

    return (
      <div>
        {ui.loading && renderLoading()}
        {ui.errors && renderErrors()}
        {(data && data.id) && renderForm()}
        {!ui.loading && !data && <div>No data to show</div>}
      </div>
    )

  }

}

const mapStateToProps = (state) => ({
  state: state && state.modules && state.modules.editform
});

export default connect(mapStateToProps)(EditFormHandler);
