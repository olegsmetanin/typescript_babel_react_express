import ICommand from './../interfaces/ICommand'

export default class DelayedValue implements ICommand<Promise<any>> {

  wait: number;
  value: any;

  constructor(value: any, wait: number) {
    this.wait = wait;
    this.value = value;
  }

  execute() {
    return new Promise<any>(resolve => setTimeout(() => resolve(this.value), this.wait));
  }

}
