import TEBEvent from '../event/TEBEvent';

export class FailedToConnectEvent extends TEBEvent<string> {
  static type = 'FailedToConnectEvent';
  type = FailedToConnectEvent.type;
}
