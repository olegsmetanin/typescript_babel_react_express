import IEvent from './IEvent';

interface IEventEmitter {
  on(event: IEvent, handler: Function): IEventEmitter;
  off(event: IEvent, handler: Function): IEventEmitter;
  emit(event: IEvent): boolean;
}

export default IEventEmitter;
