/**
 * Logger abstraction
 */
interface ILogger {

  /**
   * Write trace info to log (for tracing code execution)
   * @param {any} ...args arguments
   */
  trace(...args): void;

  /**
   * Write debug info to log (for restore environment and behavior of code by
   * logged internal state of system)
   * @param {any} ...args arguments
   */
  debug(...args): void;

  /**
   * Write warn info about not critical states in system (but required attention)
   * @param {any} ...args arguments
   */
  warning(...args): void;

  /**
   * Write exception, occured in system
   * @param {any} ...args arguments
   */
  error(...args): void;

}

export default ILogger;
