import ILogger from './ILogger';

export default class ConsoleLogger implements ILogger {

  private log(level: string, args: any[]) {
    let method: string = 'log';
    if (level === 'WARNING') {
      method = 'warn';
    } else if (level === 'ERROR') {
      method = 'error';
    }
    console[method].apply(this, [level, new Date().toISOString()].concat(args));
    if (level === 'ERROR') {
      args.forEach(e => {
        if (e instanceof Error) {
          console.error(level, new Date().toISOString(), e.stack);
        }
      })
    }
  }

  trace(...args) {
    this.log('TRACE', args || []);
  }

  debug(...args) {
    this.log('DEBUG', args || []);
  }

  warning(...args) {
    this.log('WARNING', args || []);
  }

  error(...args) {
    this.log('ERROR', args || []);
  }

}
