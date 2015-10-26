import * as React from 'react';
import CatchServerException from '../commands/CatchServerException';
import IHTTPClient from '../../framework/server/interfaces/IHTTPClient';
import IInvoke from '../../framework/server/interfaces/IInvoke';

interface ICatchHandlerContext {
  httpClient : IHTTPClient;
  invoke     : IInvoke;
}

interface ICatchHandlerState {
  callNumber? : number;
  errors?     : any;
}

export default class CatchHandler extends React.Component<{}, ICatchHandlerState> {

  context: ICatchHandlerContext

  static contextTypes: React.ValidationMap<any> = {
    httpClient : React.PropTypes.object.isRequired,
    invoke     : React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  callApi = async () => {
    const {httpClient, invoke} = this.context;
    let {callNumber = 0} = this.state;
    callNumber++;
    try {
      await invoke<void>(new CatchServerException({counter: callNumber, httpClient}));
      this.setState({errors: {general: 'Error not catched!!!'}});
    } catch(e) {
      console.error('e', e);
      this.setState({errors: e.errors});
    } finally {
      this.setState({callNumber});
    }
  }

  render() {

    return (
      <div>
        <div>Press btn to call api</div>
        <button onClick={this.callApi}>Call api</button>
        <div style={{display: 'block', backgroundColor: '#eee', color: 'red'}}>
          {JSON.stringify(this.state)}
        </div>
      </div>
    )

  }

}
