import IEventEmitter from './IEventEmitter';
import IEvent from './IEvent';

interface IEventBus extends IEventEmitter {
  on(event: IEvent, handler: Function): IEventBus;
  off(event: IEvent, handler: Function): IEventBus;
  emit(event: IEvent): boolean;
}

export default IEventBus;
