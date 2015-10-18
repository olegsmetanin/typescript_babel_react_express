import Command from './../interfaces/Command'

export default class Delay extends Command<Promise<void>> {

  className = 'Delay';

  wait: number;

  constructor(wait: number) {
    super();
    this.wait = wait;
  }

  execute() {
    return new Promise<void>(resolve => setTimeout(resolve, this.wait));
  }

}
