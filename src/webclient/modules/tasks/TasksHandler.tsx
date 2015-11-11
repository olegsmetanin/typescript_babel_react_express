/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Task} from './model';

interface ITasksHandlerProps {
  tasks: Task[];
}

interface ITasksHandlerState {

}

class TasksHandler extends React.Component<ITasksHandlerProps, ITasksHandlerState> {

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
  tasks: state.tasks
});

export default connect(mapStateToProps)(TasksHandler);
