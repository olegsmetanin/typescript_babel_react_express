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
