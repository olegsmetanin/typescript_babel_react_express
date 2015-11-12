/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
import {Task, TaskStatus} from '../model';

interface ITaskItemProps extends React.Props<TaskItem> {
  task: Task;
}

export default class TaskItem extends React.Component<ITaskItemProps, {}> {

  private static TaskStatusColors = {
    [TaskStatus.NEW]     : 'red',
    [TaskStatus.RUNNING] : 'blue',
    [TaskStatus.DONE]    : 'gray',
  }

  render() {
    const {task} = this.props;

    const renderStatus = (status: TaskStatus) => {
      const color = TaskItem.TaskStatusColors[status];
      return <span style={{float: 'right', color}}>{TaskStatus[status].toUpperCase()}</span>;
    };

    return (
      <div style={{width: '400px', marginBottom: '5px'}}>
        <strong>#{task.id}</strong>
        {' '}
        <span>{task.title}</span>
        {renderStatus(task.status)}
      </div>
    )
  }

}
