/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import {bindActionCreators, Store, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {Task} from './model';
import * as TasksActions from './actions';
import IHTTPClient from "../../../framework/common/http/IHTTPClient";

interface ITasksHandlerContext {
  httpClient: IHTTPClient;
}

interface ITasksHandlerProps {
  tasks: Task[];
  dispatch: Dispatch;
}

interface ITasksHandlerState {
  actions: any
}

class TasksHandler extends React.Component<ITasksHandlerProps, ITasksHandlerState> {

  context: ITasksHandlerContext;

  static contextTypes: React.ValidationMap<any> = {
    httpClient: React.PropTypes.object.isRequired,
  };

  static async composeState(dispatch: Dispatch, httpClient: IHTTPClient) {
    await dispatch(TasksActions.requestTasks('server filter 10 11', httpClient));
  }

  constructor(props, context) {
    super(props, context);
  }

  state: ITasksHandlerState = {
    actions: bindActionCreators(TasksActions, this.props.dispatch),
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      console.log(`${new Date().toISOString()} dispatching action requestTasks`);
      this.state.actions.requestTasks('client filter 3 4', this.context.httpClient);
      console.log(`${new Date().toISOString()} dispatched action requestTasks`);
    }
  }

  render() {
    const {tasks} = this.props;

    return (
      <div>
        <hr />
        TODO tasks list {JSON.stringify(tasks)}
      </div>
    )
  }

}

const mapStateToProps = state => ({
  tasks: state.modules && state.modules.tasks
});

export default connect(mapStateToProps)(TasksHandler);
