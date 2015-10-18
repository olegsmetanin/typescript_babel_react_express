import ICommand from './ICommand';

abstract class Command<T> implements ICommand<T> {
  name = 'Command';
  abstract execute(): T
}

export default Command;
