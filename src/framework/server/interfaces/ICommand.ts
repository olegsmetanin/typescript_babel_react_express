interface ICommand<T> {
  name: string;
  execute(): T;
}

export default ICommand;
