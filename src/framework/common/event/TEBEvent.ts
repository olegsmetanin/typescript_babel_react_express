import EBEvent from './EBEvent';

export default class TEBEvent<T> extends EBEvent {
  data: T;

  constructor(data: T) {
    super();
    this.data = data;
  }
}
