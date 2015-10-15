import ICommand from './ICommand';

abstract class Command<T> implements ICommand<T> {
  name(): string {
    return this.constructor.toString().match(/\w+/g)[1];
  }
  abstract execute(): T
}

export default Command;
