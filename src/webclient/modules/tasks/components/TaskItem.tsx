/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
import {Task, TaskStatus, Executor} from '../model';

interface ITaskItemProps extends React.Props<TaskItem> {
  task: Task;
  executors: (Executor[] | boolean | Error);
  onExpand: (id: number) => void;
}

interface ITaskItemState {
  collapsed: boolean;
}

export default class TaskItem extends React.Component<ITaskItemProps, ITaskItemState> {

  private static TaskStatusColors = {
    [TaskStatus.NEW]     : 'red',
    [TaskStatus.RUNNING] : 'blue',
    [TaskStatus.DONE]    : 'gray',
  }

  state: ITaskItemState = {collapsed: true};

  toggle = () => {
    let {collapsed} = this.state;
    collapsed = !collapsed;
    if (!collapsed) {
      this.props.onExpand(this.props.task.id);
    }
    this.setState({collapsed});
  }

  render() {
    const {task, executors} = this.props;
    const {collapsed} = this.state;

    const renderStatus = (status: TaskStatus) => {
      const color = TaskItem.TaskStatusColors[status];
      return <span style={{float: 'right', color}}>{TaskStatus[status].toUpperCase()}</span>;
    };

    const renderExecutors = (e: (Executor[] | boolean | Error)) => {
      if (typeof e === 'boolean' && e === true) {
        return <i>Loading task executors...</i>;
      }

      if (e instanceof Error) {
        const err: Error = e;
        return <span style={{color: 'red'}}>{err.message}</span>
      }

      if (e instanceof Array) {
        const arr: Executor[] = e;
        return !arr.length
          ? <i>This task has no executors</i>
          : <ul>{arr.map(executor => <li>#{executor.id}&nbsp;{executor.name}</li>)}</ul>;
      }

      throw new Error(`Unknown executors type ${typeof e}`);
    };

    return (
      <div style={{width: '400px', marginBottom: '5px'}}>
        <div>
          <strong>#{task.id}</strong>
          {' '}
          <span>{task.title}</span>

          {renderStatus(task.status)}
          <a style={{cursor: 'pointer', float: 'right', marginRight: '5px'}} onClick={this.toggle}>Executors</a>
        </div>

        {collapsed === false && <div>{renderExecutors(executors)}</div>}
      </div>
    )
  }

}
