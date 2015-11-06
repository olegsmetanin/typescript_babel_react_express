import EBEvent from '../../common/event/EBEvent';

/**
 * Event emitted, when http call failed bue to broken connection
 */
export default class ConnectionBrokenEvent extends EBEvent {
  static type = 'ConnectionBrokenEvent';
  type = ConnectionBrokenEvent.type;
}
