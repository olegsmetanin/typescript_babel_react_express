import EBEvent from '../../../framework/common/event/EBEvent';
import TEBEvent from '../../../framework/common/event/TEBEvent';

export default class ToUserEvent extends TEBEvent<EBEvent> {
  static type = 'ToUserEvent';
  type = ToUserEvent.type;
  user:string;

  constructor(user: string, data: EBEvent) {
    super(data);
    this.user = user;
  }
}
