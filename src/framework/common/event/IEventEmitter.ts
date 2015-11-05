import EBEvent from './EBEvent';

interface IEventEmitter {
  on<T extends EBEvent>(type: string, handler: (event: T) => void): IEventEmitter;
  off<T extends EBEvent>(type: string, handler: (event: T) => void): IEventEmitter;
  emit<T extends EBEvent>(event: T): boolean;
}

export default IEventEmitter;
