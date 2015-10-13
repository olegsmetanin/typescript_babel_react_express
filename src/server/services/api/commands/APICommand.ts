import ICommand from './../../../../framework/server/interfaces/ICommand';

export default class APICommand implements ICommand<Promise<string>> {

  execute() {
    return new Promise<string>(resolve => setTimeout(() => resolve('qwe'), 1000))
  }

}
