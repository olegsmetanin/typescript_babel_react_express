import EBEvent from '../../common/event/EBEvent';

/**
 * Event emitted, when http call failed as not-authenticated and
 * user login required before resend
 */
export default class AuthRequiredEvent extends EBEvent {
  static type = 'AuthRequiredEvent';
  type = AuthRequiredEvent.type;
}
