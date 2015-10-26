import ICommand from './ICommand';

abstract class Command<T> implements ICommand<T> {
  className = 'Command';
  abstract execute(): T
}

export default Command;
