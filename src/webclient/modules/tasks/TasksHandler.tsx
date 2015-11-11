/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import {bindActionCreators, Store, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {Task} from './model';
import * as TasksActions from './actions';

interface ITasksHandlerProps {
  tasks: Task[];
  dispatch: Dispatch;
}

interface ITasksHandlerState {
  actions: any
}

class TasksHandler extends React.Component<ITasksHandlerProps, ITasksHandlerState> {

  static async composeState(dispatch: Dispatch) {
    try {
      await dispatch(TasksActions.requestTasks('server filter'));
    } catch(e) {
      console.error(e);
    }
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
      this.state.actions.requestTasks('client filter');
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
