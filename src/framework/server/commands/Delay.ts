import ICommand from './../interfaces/ICommand'

export default class Delay implements ICommand<Promise<void>> {

  wait: number;

  constructor(wait: number) {
    this.wait = wait;
  }

  execute() {
    return new Promise<void>(resolve => setTimeout(resolve, this.wait));
  }

}
