import ICommand from '../command/ICommand';

interface IInvoke {
    <T>(command: ICommand<T>): T;
}

export default IInvoke;
