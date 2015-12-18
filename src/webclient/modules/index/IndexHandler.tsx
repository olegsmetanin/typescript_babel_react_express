import * as React from 'react';
import { Link } from 'react-router';
var DocumentMeta = require('react-document-meta');
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IModuleState} from './model';
import IndexApi from './api';
import actionsFactory from './actions';


interface IIndexHandlerContext {
  httpClient: IHTTPClient;
}

interface IIndexHandlerProps {
  state    : IModuleState;
  dispatch : Dispatch;
}

class IndexHandler extends React.Component<IIndexHandlerProps, {}> {

  static contextTypes: React.ValidationMap<any> = {
    httpClient: React.PropTypes.object.isRequired,
  };

  static async composeState(dispatch: Dispatch, httpClient: IHTTPClient) {
    const api = new IndexApi({httpClient});
    await dispatch(actionsFactory({api}).requestData({a: 'a'}));
  }


  context: IIndexHandlerContext;
  actions: any;

  constructor(props, context) {
    super(props, context);

    const api = new IndexApi({httpClient: context.httpClient});
    this.actions = bindActionCreators(actionsFactory({api}), props.dispatch);
  }

  componentWillMount() {
    if (typeof window !== 'undefined' && !this.props.state.data) {
      this.actions.requestData({a: 'a'});
    }
  }

  render() {
    const {data} = this.props.state;

    return <div>
      <DocumentMeta
        title={'React-blog: Home'}
      />

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      <ul>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/catch">Catch server error</Link>
        </li>
        <li>
          <Link to="/tasks">Master-details example</Link>
        </li>
        <li>
          <Link to="/pingpong">Socket.io ping-pong</Link>
        </li>
        <li>
          <Link to="/editform">Edit form validation</Link>
        </li>
        <li>
          <Link to="/listform">List & form example</Link>
        </li>
        <li>
          <a href="http://localhost:3000/api-doc/?url=http://localhost:3000/static/api.json" target="_blank">swagger</a> 
        </li>
      </ul>
    </div>;
  }

}

const mapStateToProps = (state) => ({
  state: state.modules && state.modules.index
});

export default connect(mapStateToProps)(IndexHandler);
