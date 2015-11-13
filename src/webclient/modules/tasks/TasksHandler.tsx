/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
import {bindActionCreators, Store, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {Task, Executor, ITasksModuleState} from './model';
import * as TasksActions from './actions';
import IHTTPClient from "../../../framework/common/http/IHTTPClient";
import TaskItem from './components/TaskItem';
import TaskFilter from './components/TaskFilter';

interface ITasksHandlerContext {
  httpClient: IHTTPClient;
}

interface ITasksHandlerProps {
  state: ITasksModuleState;
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
      this.state.actions.requestTasks('client filter 3 4 6', this.context.httpClient);
      console.log(`${new Date().toISOString()} dispatched action requestTasks`);
    }
  }

  onSearch = (filter: {search: string}) => {
    this.state.actions.requestTasks(filter.search, this.context.httpClient);
  }

  onExpandExecutors = (id: number) => {
    const {state: {data:{tasks, executors}}} = this.props;
    const task: Task = tasks.find((task: Task) => task.id === id);
    if (!task) return;

    const eids: number[] = task.executors || [];
    if (!eids.length) return;
    let toLoad: number[] = eids.map(eid => executors.some(e => e.id === eid) ? null : eid).filter(eid => !!eid);
    if (!toLoad.length) return;

    this.state.actions.requestTaskExecutors(id, toLoad, this.context.httpClient);
  }

  mapExecutorsToModels = (task: Task): (Executor[] | boolean | Error) => {
    //console.log('mapE2M called');
    const {state: {view, data: {executors}}} = this.props;
    if (view[task.id] === true || view[task.id] instanceof Error) {
      return view[task.id];
    }

    return Array.isArray(task.executors) ? task.executors.map(id => executors.find((e: Executor) => e.id === id)) : [];
  }

  render() {
    const {state: {data, view}} = this.props;

    return (
      <div>
        <hr />
        <TaskFilter onSearch={this.onSearch} loading={view.loading} />

        {view.loading === true && <div>Loading...</div>}
        {data.tasks.map((task: Task) =>
          <TaskItem key={task.id} task={task} executorsFn={() => this.mapExecutorsToModels(task)} onExpand={this.onExpandExecutors} />)}

        TODO paging, sorting <br/>
        Debug state: {JSON.stringify(this.props.state)};
        <br/>
        Hint: load executor #6 (for ex. in task #4) throw test api error
      </div>
    )
  }

}

const mapStateToProps = state => ({
  state: state.modules && state.modules.tasks
});

export default connect(mapStateToProps)(TasksHandler);
