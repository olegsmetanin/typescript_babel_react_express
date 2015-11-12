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

export interface ITasksModuleState {
  data: {
    tasks     : Task[];
    count     : number;
    executors : Executor[];
  },
  view?: {
    loading? : boolean;
    error?   : (Error|{});
    [key: number]: (boolean | Error)
  }
}
