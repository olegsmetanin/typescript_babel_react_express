import EBEvent from '../event/EBEvent';

export class FailedToConnectEvent extends EBEvent {
  static type = 'FailedToConnectEvent';
  type = FailedToConnectEvent.type;
  data: string;
  constructor(data: string) {
    super();
    this.data = data;
  }
}
