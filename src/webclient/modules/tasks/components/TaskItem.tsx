/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
import {Task, TaskStatus, Executor, IExecutorEditState} from '../model';
import ExecutorEditor from './ExecutorEditor';

interface ITaskItemProps extends React.Props<TaskItem> {
  task             : Task;
  editState        : {[executorId: number]: IExecutorEditState};
  executorsFn      : () => (Executor[] | boolean | Error);
  onExpand         : (id: number) => void;
  onEditExecutor   : (taskId: number, executorId: number) => void;
  onSaveExecutor   : (taskId: number, executorId: number, name: string) => void;
  onCancelExecutor : (taskId: number, executorId: number) => void;
}

interface ITaskItemState {
  collapsed: boolean;
}

export default class TaskItem extends React.Component<ITaskItemProps, ITaskItemState> {

  private static TaskStatusColors = {
    [TaskStatus.NEW]     : 'red',
    [TaskStatus.RUNNING] : 'blue',
    [TaskStatus.DONE]    : 'gray',
  };

  state: ITaskItemState = {collapsed: true};

  toggle = () => {
    let {collapsed} = this.state;
    collapsed = !collapsed;
    if (!collapsed) {
      this.props.onExpand(this.props.task.id);
    }
    this.setState({collapsed});
  };

  onSaveExecutor = (id: number, name: string) => {
    const {task} = this.props;
    this.props.onSaveExecutor(task.id, id, name);
  };

  onCancelExecutor = (id: number) => {
    const {task} = this.props;
    this.props.onCancelExecutor(task.id, id);
  };

  onEditExecutor = (id: number) => {
    const {task} = this.props;
    this.props.onEditExecutor(task.id, id)
  };

  render() {
    const {task, executorsFn, editState} = this.props;
    const {collapsed} = this.state;

    const renderStatus = (status: TaskStatus) => {
      const color = TaskItem.TaskStatusColors[status];
      return <span style={{float: 'right', color}}>{TaskStatus[status].toUpperCase()}</span>;
    };

    const renderExecutor = (e: Executor, editState: IExecutorEditState) => {
      return !editState || editState.viewMode
        ? <span style={{cursor: 'pointer'}} onClick={() => this.onEditExecutor(e.id)}>#{e.id}&nbsp;{e.name}</span>
        : <div>
            <ExecutorEditor
                executor={e}
                progress={editState.progress}
                onSave={this.onSaveExecutor}
                onCancel={this.onCancelExecutor}
            />
            {editState.error && <span style={{color: 'red'}}>{editState.error.message}</span>}
          </div>
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
          :<ul>{ arr.map(executor => <li key={executor.id}>{renderExecutor(executor, editState && editState[executor.id])}</li>) }</ul>;
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

        {collapsed === false && <div>{renderExecutors(executorsFn())}</div>}
      </div>
    )
  }

}
