import * as React from 'react';
var ReactRouter = require('react-router');
import IEventBus from '../../../../framework/common/event/IEventBus';
import AuthRequiredEvent from '../../../../framework/client/events/AuthRequired';
import ConnectionBrokenEvent from '../../../../framework/client/events/ConnectionBroken';
import BufferDropEvent from "../../../../framework/client/events/BufferDrop";
import BufferRetryEvent from "../../../../framework/client/events/BufferRetry";
import SigninEvent from '../../../../framework/client/events/Signin';
import {IPopupState} from '../model';


interface IPopupProps extends React.Props<Popup> {
  state    : IPopupState;
  actions  : any;
}

interface IPopupContext {
  history    : any;
  eventBus   : IEventBus;
}

export default class Popup extends React.Component<IPopupProps, {}> {

  static contextTypes: React.ValidationMap<any> = {
    history    : React.PropTypes.object.isRequired,
    eventBus   : React.PropTypes.object.isRequired,
  };

  context: IPopupContext;

  componentWillMount() {
    this.context.eventBus.on<AuthRequiredEvent>(AuthRequiredEvent.type, this.onAuthRequired);
    this.context.eventBus.on<ConnectionBrokenEvent>(ConnectionBrokenEvent.type, this.onConnectionBroken);
  }

  componentWillUnmount() {
    this.context.eventBus.off<AuthRequiredEvent>(AuthRequiredEvent.type, this.onAuthRequired);
    this.context.eventBus.off<ConnectionBrokenEvent>(ConnectionBrokenEvent.type, this.onConnectionBroken);
  }

  onAuthRequired = () => {
    const {open} = this.props.state;
    if (open) return;

    this.props.actions.popupModeChange({open: true, auth: true, reconnect: false});
  };

  onConnectionBroken = () => {
    const {open} = this.props.state;
    if (open) return;

    this.props.actions.popupModeChange({open: true, auth: false, reconnect: true});
  };

  cancel = () => {
    this.props.actions.popupModeChange({open: false, auth: false, reconnect: false});

    this.context.eventBus.emit(new BufferDropEvent('User cancel pending requests'));
    this.context.history.pushState(null, '/');
  };

  login = async () => {
    await this.props.actions.requestLogin();

    this.context.eventBus.emit(new BufferRetryEvent());
    this.context.eventBus.emit(new SigninEvent());
  };

  retry = () => {
    this.props.actions.popupModeChange({open: false, auth: false, reconnect: false});

    this.context.eventBus.emit(new BufferRetryEvent());
  };

  render() {
    const {open, auth, reconnect, errors} = this.props.state;

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
