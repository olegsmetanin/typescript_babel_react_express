import * as React from 'react';
import IEventBus from '../../framework/common/event/IEventBus';
import IHTTPClient from "../../framework/common/http/IHTTPClient";
import IInvoke from '../../framework/common/invoke/IInvoke';
import AuthRequiredEvent from '../../framework/client/events/AuthRequired';
import ConnectionBrokenEvent from '../../framework/client/events/ConnectionBroken';
import BufferDropEvent from "../../framework/client/events/BufferDrop";
import BufferRetryEvent from "../../framework/client/events/BufferRetry";
import Login from "../commands/Login";

interface IPopupState {
  open      : boolean;
  auth      : boolean;
  reconnect : boolean;
  errors?   : any;
}

interface IPopupContext {
  router     : ReactRouter.Context;
  httpClient : IHTTPClient;
  eventBus   : IEventBus;
  invoke     : IInvoke;
}

export default class Popup extends React.Component<{}, IPopupState> {

  static contextTypes: React.ValidationMap<any> = {
    router     : React.PropTypes.func.isRequired,
    httpClient : React.PropTypes.object.isRequired,
    eventBus   : React.PropTypes.object.isRequired,
    invoke     : React.PropTypes.func.isRequired,
  }

  context: IPopupContext;

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      auth: false,
      reconnect: false,
    };
  }

  componentWillMount() {
    this.context.eventBus.on<AuthRequiredEvent>(AuthRequiredEvent.type, this.onAuthRequired);
    this.context.eventBus.on<ConnectionBrokenEvent>(ConnectionBrokenEvent.type, this.onConnectionBroken);
  }

  componentWillUnmount() {
    this.context.eventBus.off<AuthRequiredEvent>(AuthRequiredEvent.type, this.onAuthRequired);
    this.context.eventBus.off<ConnectionBrokenEvent>(ConnectionBrokenEvent.type, this.onConnectionBroken);
  }

  onAuthRequired = () => {
    const {open} = this.state;
    if (open) return;

    this.setState({open: true, auth: true, reconnect: false});
  }

  onConnectionBroken = () => {
    const {open} = this.state;
    if (open) return;

    this.setState({open: true, auth: false, reconnect: true});
  }

  cancel = () => {
    this.setState({open: false, auth: false, reconnect: false});
    this.context.eventBus.emit(new BufferDropEvent('User cancel pending requests'));
    this.context.router.transitionTo("home");
  }

  login = async () => {
    const {httpClient, eventBus, invoke} = this.context;
    try {
      await invoke(new Login({httpClient}));
      this.setState({open: false, auth: false, reconnect: false});
      eventBus.emit(new BufferRetryEvent());
    } catch(e) {
      this.state.errors = e.errors;
      this.setState(this.state);
    }
  }

  retry = () => {
    this.setState({open: false, auth: false, reconnect: false});
    this.context.eventBus.emit(new BufferRetryEvent());
  }

  render() {
    const {open, auth, reconnect, errors} = this.state;

    return !open ? null : (
      <div className="popup" style={{width: '40%', height: '200px', position: 'absolute', left: '30%', backgroundColor: '#eee'}}>
        {auth && <div>Login required</div>}
        {auth && <button type="button" onClick={this.login}>Login</button>}

        {reconnect && <div>Offline. Try to reconnect</div>}
        {reconnect && <button type="button" onClick={this.retry}>Reconnect</button>}

        <button type="button" onClick={this.cancel}>Cancel</button>
        {errors && <div style={{color: 'red'}}>{JSON.stringify(errors)}</div>}
      </div>
    )
  }

}
