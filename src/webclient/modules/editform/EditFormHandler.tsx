/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {FormData, IModuleState} from './model';
import actionsFactory from './actions';
import EditFormApi from './api';
import ViewForm from './components/ViewForm';
import EditForm from './components/EditForm';

interface IContext {
  httpClient: IHTTPClient;
}

interface IProps extends React.Props<EditFormHandler> {
  state    : IModuleState;
  dispatch : Dispatch;
}

interface IState {
  editMode: boolean;
}

class EditFormHandler extends React.Component<IProps, IState> {

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
  state: IState = {editMode: false};

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

  save = async (data: FormData) => {
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
//console.log('data to save', data);
    var result = v.validate(data, formSchema);
    if (result.errors.length) {
      console.log('Validation errors!', result);
      this.actions.validateForm(result.errors);
    } else {
      await this.actions.saveForm(data);
      this.setState({editMode: false});
    }
  };

  startEdit = () => {
    this.setState({editMode: true});
  };

  render() {
    const {editMode} = this.state;
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
          !editMode
            ? <ViewForm data={data} onEdit={this.startEdit} />
            : <EditForm data={data} saving={ui.saving} onSave={changedData => this.save(changedData)} />
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
