/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import IEventBus from '../../../framework/common/event/IEventBus';
import {IUser} from '../../../common/model';
import {ServerMessage} from './model';
import TEBEvent from '../../../framework/common/event/TEBEvent';
import PingEvent from '../../../common/events/PingEvent';
import PongEvent from '../../../common/events/PongEvent';
import * as actions from './actions';


interface IContext {
  eventBus: IEventBus;
}

interface IProps extends React.Props<PingPongHandler> {
  me       : IUser;
  messages : ServerMessage[];
  dispatch : Dispatch;
}

class PingPongHandler extends React.Component<IProps, {}> {

  static contextTypes: React.ValidationMap<any> = {
    eventBus: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.actions = bindActionCreators(actions, props.dispatch);
  }

  context: IContext;
  actions: any;

  componentWillMount() {
    this.context.eventBus.on<PongEvent>(PongEvent.type, this.handlePongEvent);
  }

  componentWillUnmount() {
    this.context.eventBus.off<PongEvent>(PongEvent.type, this.handlePongEvent);
  }

  handlePongEvent = (e: PongEvent) => {
    this.actions.pongRecieved(e);
  };

  send = () => {
    const {me} = this.props;
    const msg = ReactDOM.findDOMNode<HTMLInputElement>(this.refs['msg']).value;
    const delay = ReactDOM.findDOMNode<HTMLInputElement>(this.refs['delay']).value;
    if (!msg || !Number.isFinite(parseInt(delay, 10))) return;

    const payload = new PingEvent({user: me.id, msg, delay: parseInt(delay, 10)});
    const event = new TEBEvent<PingEvent>(payload);
    event.type = 'toServer';
    this.context.eventBus.emit(event);
  };

  render() {
    const {me, messages} = this.props;

    const renderMessages = () => {
      if (!messages) return null;

      if (!messages.length) return <div>No messages</div>;

      return (
        <ul>
          {
            messages.map((m: ServerMessage) => {
              return (
                <li key={m.numpp}>
                  <b>#{m.numpp}</b>&nbsp;
                  <span>{m.msg}</span>&nbsp;
                  <span>{m.recieved}</span>
                </li>
              )
            })
          }
        </ul>
      );
    };

    return (
      <div>
        {(!me || !me.id) && <div>Please, signin before</div>}
        {me && me.id &&
          <div>
            <input type="text" placeholder="Input event msg" ref="msg"/>
            <br/>
            <input type="text" placeholder="Input pong delay in ms" ref="delay"/>
            <br/>
            <button type="button" onClick={this.send}>Send ping event</button>
            <br/>

            {renderMessages()}
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  me       : state && state.modules && state.modules.auth     && state.modules.auth.me,
  messages : state && state.modules && state.modules.pingpong && state.modules.pingpong.messages,
});

export default connect(mapStateToProps)(PingPongHandler);
