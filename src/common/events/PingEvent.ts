import TEBEvent from '../../framework/common/event/TEBEvent';

export default class PingEvent extends TEBEvent<{user: string, msg: string, delay: number}> {
  static type = 'PingEvent';
  type = PingEvent.type;
}
