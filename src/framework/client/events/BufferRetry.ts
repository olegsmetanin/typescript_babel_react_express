import EBEvent from '../../common/event/EBEvent';

/**
 * Event emitted, when user actions, initiated by AuthRequired or ConnectionBroken
 * events, completed, and httpBuffer should resend all caught calls
 */
export default class BufferRetryEvent extends EBEvent {
  static type = 'BufferRetryEvent';
  type = BufferRetryEvent.type;
}
