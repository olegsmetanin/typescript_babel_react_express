import * as React from 'react';
import CatchServerException from '../commands/CatchServerException';
import TrySecureEndpoint from '../commands/TrySecuredEndpoint';
import IHTTPClient from '../../framework/common/http/IHTTPClient';
import IInvoke from '../../framework/common/invoke/IInvoke';

interface ICatchHandlerContext {
  httpClient : IHTTPClient;
  invoke     : IInvoke;
}

interface ICatchHandlerState {
  callNumber? : number;
  errors?     : any;
  data?       : any;
}

export default class CatchHandler extends React.Component<{}, ICatchHandlerState> {

  context: ICatchHandlerContext;

  static contextTypes: React.ValidationMap<any> = {
    httpClient : React.PropTypes.object.isRequired,
    invoke     : React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  callThrowApi = async () => {
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

  callAuthorizedApi = async () => {
    const {httpClient, invoke} = this.context;
    try {
      const data = await invoke(new TrySecureEndpoint({httpClient}));
      this.setState({data});
    } catch(e) {
      console.error('e', e);
      this.setState({errors: e.errors});
    }
  }

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
          {JSON.stringify(this.state)}
        </div>
      </div>
    )

  }

}
