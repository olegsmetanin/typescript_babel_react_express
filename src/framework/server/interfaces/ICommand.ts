interface ICommand<T> {
  execute(): T
}

export default ICommand;
