import * as React from 'react';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IModuleState} from './model';
import CatchApi from './api';
import actionsFactory from './actions';


interface IProps extends React.Props<CatchHandler> {
  state    : IModuleState;
  dispatch : Dispatch;
}

interface ICatchHandlerContext {
  httpClient : IHTTPClient;
}

class CatchHandler extends React.Component<IProps, {}> {

  context: ICatchHandlerContext;
  actions: any;

  static contextTypes: React.ValidationMap<any> = {
    httpClient : React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    const api = new CatchApi({httpClient: context.httpClient});
    this.actions = bindActionCreators(actionsFactory({api}), props.dispatch);
  }

  callThrowApi = async () => {
    let {callNumber} = this.props.state;
    callNumber++;
    this.actions.requestThrowEndpoint(callNumber);
  };

  callAuthorizedApi = async () => {
    this.actions.requestSecuredEndpoint();
  };

  render() {

    return (
      <div>
        <div>Press btn to call throw api</div>
        <button onClick={this.callThrowApi}>Call throw api</button>
        <br/>
        <div>Press btn to call auth api</div>
        <button onClick={this.callAuthorizedApi}>Call auth api</button>
        <br/>
        <div style={{display: 'block', backgroundColor: '#eee', color: 'red'}}>
          {JSON.stringify(this.props.state)}
        </div>
      </div>
    )

  }

}

const mapStateToProps = (state) => ({
  state: state && state.modules && state.modules.catch
});

export default connect(mapStateToProps)(CatchHandler);
