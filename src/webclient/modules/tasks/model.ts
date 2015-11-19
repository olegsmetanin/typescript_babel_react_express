export enum TaskStatus {
  NEW     = 1,
  RUNNING = 2,
  DONE    = 3,
}

export class Task {
  id        : number;
  title     : string;
  status    : TaskStatus;
  executors : number[];
}

export class Executor {
  id    : number;
  name  : string;
  tasks : number[];
}

export interface IExecutorEditState {
  viewMode: boolean;
  progress: boolean;
  error?  : Error;
}

//UI models (state in redux state tree)
export interface ITasksState {
  items: Task[];
  count: number;
  ui: {
    loading: boolean;
    error? : Error;
  }
}

export interface IExecutorsState {
  executors: Executor[];
  ui: {
    [taskId: number]: (boolean | Error)
  }
}

export interface IEditState {
  [taskId: number]: {
    [executorId: number]: IExecutorEditState;
  }
}

export interface IModuleState {
  tasks   : ITasksState;
  details : IExecutorsState;
  editors : IEditState;
}
