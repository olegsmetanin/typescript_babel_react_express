import ICommand from './ICommand';

interface IInvoke {
    <T>(command: ICommand<T>): T;
}

export default IInvoke;
