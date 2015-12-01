import EBEvent from '../../common/event/EBEvent';

/**
 * Event emitted, when user logout
 */
export default class SignoutEvent extends EBEvent {
  static type = 'SignoutEvent';
  type = SignoutEvent.type;
}
