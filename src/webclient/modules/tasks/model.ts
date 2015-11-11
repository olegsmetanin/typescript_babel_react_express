export enum TaskStatus {
  NEW = 1,
  RUNNING,
  DONE,
}

export class Task {
  id:number;
  title:string;
  status: TaskStatus;
  //TODO executors
}

export interface ITasksModuleState {
  tasks: Task[];
  count: number;
  loading?: boolean;
  error?: (Error|{})
}
