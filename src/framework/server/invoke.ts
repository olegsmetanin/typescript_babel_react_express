import ICommand from './interfaces/ICommand';

export default function invoke<T>(command: ICommand<T>) {
  return command.execute();
}
