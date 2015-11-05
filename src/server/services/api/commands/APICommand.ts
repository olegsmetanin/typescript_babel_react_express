import Command from './../../../../framework/common/command/Command';

interface IAPICommandOptions {
  value: number;
  timeout: number;
}

export default class APICommand extends Command<Promise<number>> {

  className = 'APICommand';

  options: IAPICommandOptions;

  constructor(options: IAPICommandOptions) {
    super();
    this.options = options;
  }

  execute() {
    return new Promise<number>(resolve => setTimeout(() => resolve(this.options.value), this.options.timeout))
  }

}
