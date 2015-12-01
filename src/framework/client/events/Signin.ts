import EBEvent from '../../common/event/EBEvent';

/**
 * Event emitted, when user logged in successfully
 */
export default class SigninEvent extends EBEvent {
  static type = 'SigninEvent';
  type = SigninEvent.type;
}
