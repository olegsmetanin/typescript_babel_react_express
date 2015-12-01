export class ServerMessage {
  numpp    : number;
  msg      : string;
  recieved : Date;
}

export interface IModuleState {
  messages: ServerMessage[]
}
