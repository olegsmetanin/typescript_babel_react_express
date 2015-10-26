import Command from '../command/Command';

export default class DelayedValue extends Command<Promise<any>> {

  className = 'DelayedValue';

  wait: number;
  value: any;

  constructor(value: any, wait: number) {
    super();
    this.wait = wait;
    this.value = value;
  }

  execute() {
    return new Promise<any>(resolve => setTimeout(() => resolve(this.value), this.wait));
  }

}
