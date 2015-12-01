import * as React from 'react';
const DocumentMeta = require('react-document-meta');
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import {bindActionCreators, Store, Dispatch} from 'redux';
import {connect} from 'react-redux';
import IEventBus from '../../../framework/common/event/IEventBus';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import SigninEvent from '../../../framework/client/events/Signin';
import SignoutEvent from '../../../framework/client/events/Signout';
import Popup from './../auth/components/Popup';
import Menu from '../menu/Menu';
import {IUserState} from './../auth/model';
import authActionsFactory from './../auth/actions';
import AuthApi from './../auth/api';

interface ILayoutProps extends React.Props<any> {
  state    : IUserState;
  dispatch : Dispatch;
}

interface ILayoutState {
  clientWidth : number;
}

interface ILayoutContext {
  httpClient : IHTTPClient;
  eventBus   : IEventBus;
  history    : any;
}

class Layout extends React.Component<ILayoutProps, ILayoutState> {

  static contextTypes: React.ValidationMap<any> = {
    httpClient : React.PropTypes.object.isRequired,
    eventBus   : React.PropTypes.object.isRequired,
    history    : React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    const {httpClient} = context;
    const api = new AuthApi({httpClient});
    this.actions =  bindActionCreators(authActionsFactory({api}), props.dispatch);
  }

  context: ILayoutContext;
  actions: any;
  state: ILayoutState = { clientWidth: 400 };

  handleResize(e) {
    if (document) {
      this.setState({clientWidth: document.getElementById('app').clientWidth});
    }
  }

  componentDidMount() {
    this.handleResize(null);
    window.addEventListener('resize', this.handleResize.bind(this));
    if (!window['loginCallBack']) {
      window['loginCallBack'] = () => {
        this.actions.requestMe();
        this.context.eventBus.emit(new SigninEvent());
      }
    }
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      this.actions.requestMe();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  onLogout = () => {
    this.actions.requestLogout();//no await is intentionally
    this.context.eventBus.emit(new SignoutEvent());
  };

  render() {
    var w = this.state.clientWidth;
    let xstyle = w < 401
      ? 'xx'
      : w < 768
        ? 'xs'
        : w < 991
          ? 'sm'
          : w < 1299
            ? 'md'
            : 'lg';

    const {state} = this.props;
    return (

      <div className={xstyle}>
        <Popup />
        <DocumentMeta title={'React-blog'} />
        <Menu
          auth={state}
          onLogout={this.onLogout}
          onGoBack={() => this.context.history.goBack()}
        />

        <div className="main_content">
          {this.props.children}
        </div>

      </div>
    )
  }

}

const mapStateToProps = state => ({
  state: state.modules && state.modules.auth
});

export default connect(mapStateToProps)(Layout);
