import TEBEvent from '../../framework/common/event/TEBEvent';

export default class PongEvent extends TEBEvent<{msg: string, recieved: Date}> {
  static type = 'PongEvent';
  type = PongEvent.type;
}
