/// <reference path="../server.d.ts"/>
/// <reference path="../../../../typings/pg/pg.d.ts"/>
import IDB, {IDBClient, IDBTransaction} from './../database/IDB';
var pg = require('pg'); // needed for Babel transpilation
//import {Client} from 'pg';

interface IPG_Config {
  connectionString: string;
}

declare type ReleaseClientFn = (err?: any) => void;

/**
 * PG client creation options
 */
interface IPGClientOptions {
  /**
   * Native pg client from node-pg library
   */
  client: any; //should be pg.Client
  /**
   * Fn for release connection to pool
   * @param [err] if provided, connection will be dropped instead of return to the pool
   */
  releaseClient: ReleaseClientFn;
  /**
   * Timeout (in ms), after each, if connection not yet returned to the pool, error will be logged
   * and connection forced to close (without return to pool)
   */
  timeout?: number;
  /**
   * Logger, used to debug leaking connections
   * @param msg debug msg
   */
  logger?: (msg) => void;
  /**
   * Stack for better debugging places, where connection leaks
   */
  stack?: string;
}

class PGError extends Error {
  pgError: Error;
}

class PGClient implements IDBClient {
  client: any;
  releaseClient: ReleaseClientFn;
  releaseTimeout: any;

  constructor(options: IPGClientOptions) {
    this.client = options.client;
    this.releaseClient = options.releaseClient;

    const logger = options.logger || console.warn;
    this.releaseTimeout = setTimeout(() => {
      logger('Db client too long unreleased to the pool');
      options.stack && logger(options.stack);
      this.releaseClient('destroy me');
    }, options.timeout || 60000);//1min by default
  }

  query(...args: any[]): Promise<any> {
    let possibleError = new PGError();//capture stack here, because before promise we have more info
    return new Promise<any>((resolve, reject) => {
      this.client.query.apply(this.client, args.concat(function(error: Error, result) {
        if (error) {
          possibleError.pgError = error;
          possibleError.message = error.message;
          reject(possibleError);
        } else {
          resolve(result);
        }
      }));
    });
  }

  release() {
    clearTimeout(this.releaseTimeout);
    this.releaseClient();
  }
}

class PGTransaction extends PGClient {

  async commit() {
    try {
      await this.query('COMMIT');
    } catch (e) {
      await this.query('ROLLBACK');
    } finally {
      this.release();
    }
  }

  async rollback() {
    try {
      await this.query('ROLLBACK');
    } finally {
      this.release();
    }
  }
}


export default class PG implements IDB {

  config: IPG_Config;

  constructor(config: IPG_Config) {
    this.config = config;

  }

  async query(...args: any[]): Promise<any> {
    let client;
    try {
      client = await this.connect();
      return await client.query(...args);
    } finally {
      client && client.release();
    }
  }

  connect(): Promise<IDBClient> {
    //pgerror stack trace not helpful in case of db error, so, we capture own stack
    const stack = new Error().stack;

    return new Promise<IDBClient>((resolve, reject) => {
      pg.connect(this.config.connectionString, function(error, client, releaseClient) {
        if (error) {
          reject(error);
        } else {
          resolve(new PGClient({client, releaseClient, stack}));
        }
      });
    })
  }

  begin(options?: any): Promise<IDBTransaction> {
    //pgerror stack trace not helpful in case of db error, so, we capture own stack
    const stack = new Error().stack;

    return new Promise<IDBTransaction>((resolve, reject) => {
      pg.connect(this.config.connectionString, function(error, client, releaseClient) {
        if (error) {
          reject(error);
        } else {
          client.query('BEGIN', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(new PGTransaction({client, releaseClient, stack}));
            }
          });
        }
      });
    });
  }

  end() {
    pg.end();
  }
}
