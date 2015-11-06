import TEBEvent from '../../common/event/TEBEvent';

/**
 * Event emitted, when user actions, initiated by AuthRequired or ConnectionBroken
 * events, cancelled, and httpBuffer should reject all caught calls and clear buffered requests
 * Optional reject reason sent within event data.
 */
export default class BufferDropEvent extends TEBEvent<string> {
  static type = 'BufferDropEvent';
  type = BufferDropEvent.type;
}
