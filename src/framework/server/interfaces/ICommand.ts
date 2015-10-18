interface ICommand<T> {
  className: string;
  execute(): T;
}

export default ICommand;
