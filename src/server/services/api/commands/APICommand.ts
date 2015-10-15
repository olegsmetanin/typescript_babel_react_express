import Command from './../../../../framework/server/interfaces/Command';

interface IAPICommandOptions {
  value: number;
  timeout: number;
}

export default class APICommand extends Command<Promise<number>> {

  options: IAPICommandOptions;

  constructor(options: IAPICommandOptions) {
    super();
    this.options = options;
  }

  async execute() {
    return new Promise<number>(resolve => setTimeout(() => resolve(this.options.value), this.options.timeout))
  }

}
