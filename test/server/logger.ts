/// <reference path="../test.d.ts"/>

import ILogger from '../../src/framework/server/interfaces/ILogger';
import ConsoleLogger from '../../src/framework/server/logging/ConsoleLogger';

describe('just an example', () => {

  let logger: ILogger;

  before(() => {
    logger = new ConsoleLogger();
  })

  it('should write all things to console', () => {

    logger.trace('some trace info', 1, true, {a: 42});
    logger.debug('some debug info', 1, true, {a: 42});
    logger.warning('some warn info', 1, true, {a: 42});
    const e = new Error('Some trouble');
    //Error.captureStackTrace(this, e); //wtf?? error TS2339: Property 'captureStackTrace' does not exist on type 'ErrorConstructor'.
    logger.error('some error info', 1, true, {a: 42}, e);

  })

})
