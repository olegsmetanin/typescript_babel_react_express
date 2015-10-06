import Command from './../interfaces/Command'

export default class DelayedValue extends Command<Promise<any>> {

  wait: number;
  value: any;

  constructor(value: any, wait: number) {
    super();
    this.wait = wait;
    this.value = value;
  }

  internalExecute() {
    return new Promise<any>(resolve => setTimeout(() => resolve(this.value), this.wait));
  }

}
