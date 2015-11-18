/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
import {Executor} from '../model';

interface IExecutorEditorProps {
  executor: Executor;
  progress: boolean;
  onSave   : (id: number, name: string) => void;
  onCancel : (id: number) => void;
}

interface IExecutorEditorState {
  name: string;
}

export default class ExecutorEditor extends React.Component<IExecutorEditorProps, IExecutorEditorState> {

  state: IExecutorEditorState = {name: this.props.executor.name};

  handleChange = (e) => {
    this.setState({name: e.target.value});
  };

  handleSave = () => {
    const {name} = this.state;
    if (!name || !name.trim().length) return;

    const {executor, onSave} = this.props;
    onSave(executor.id, name);
  };

  handleCancel = () => {
    const {executor, onCancel} = this.props;
    onCancel(executor.id);
  };

  render() {
    const {progress} = this.props;
    const {name} = this.state;

    return (
      <div>
        <input type="text" value={name} disabled={progress}
               onChange={this.handleChange} />
        <button type="button" onClick={this.handleSave} disabled={progress}>{progress === true ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={this.handleCancel} disabled={progress}>Cancel</button>
      </div>
    )
  }

}
