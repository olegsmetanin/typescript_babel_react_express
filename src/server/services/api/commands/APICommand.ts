import ICommand from './../../../../framework/server/interfaces/ICommand';

interface IAPICommandOptions {
  value: number;
  timeout: number;
}

export default class APICommand implements ICommand<Promise<number>> {

  options: IAPICommandOptions;

  constructor(options: IAPICommandOptions) {
    this.options = options;
  }

  async execute() {
    return new Promise<number>(resolve => setTimeout(() => resolve(this.options.value), this.options.timeout))
  }

}
