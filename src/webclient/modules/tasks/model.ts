export enum TaskStatus {
  NEW     = 1,
  RUNNING = 2,
  DONE    = 3,
}

export class Task {
  id     : number;
  title  : string;
  status : TaskStatus;
  //TODO executors
}

export interface ITasksModuleState {
  tasks    : Task[];
  count    : number;
  loading? : boolean;
  error?   : (Error|{})
}
