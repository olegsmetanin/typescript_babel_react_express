/// <reference path="../server.d.ts"/>
/// <reference path="../../../../typings/pg/pg.d.ts"/>

import IDB, {IDBClient, IDBTransaction} from './../database/IDB';

var pg = require('pg'); // needed for Babel transpilation

interface IPG_Config {
  connectionString: string;
}

class PGTransaction implements IDBTransaction {
  client: any;
  releaseClient: Function;

  constructor(client: any, releaseClient: Function) {
    this.client = client;
    this.releaseClient = releaseClient;
  }

  query(...args: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.client.query.apply(this.client, args.concat(function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }));
    });
  }

  async commit() {
    try {
      await this.query('COMMIT');
    } catch (e) {
      await this.query('ROLLBACK');
    } finally {
      this.releaseClient();
    }
  }

  async rollback() {
    try {
      await this.query('ROLLBACK');
    } catch (e) {
      this.releaseClient();
    }
  }
}


export default class PG implements IDB {

  config: IPG_Config;

  constructor(config: IPG_Config) {
    this.config = config;

  }

  query(...args: any[]): Promise<any> {
    //pgerror stack trace not helpful in case of db error, so, we capture own stack tract
    //let possibleError = new Error();
    //Error.captureStackTrace(possibleError, this);

    return new Promise<any>((resolve, reject) => {
      pg.connect(this.config.connectionString, function(error, client, releaseClient) {
        if (error) {
          reject(error);
        } else {
          client.query.apply(client, /*[].slice.call(arguments)*/args.concat(function(error, result) {
            releaseClient(); //wtf releaseClient(error)
            if (error) {
              //possibleError.pgError = error;
              //possibleError.message = error.message;
              reject(error);
            } else {
              resolve(result);
            }
          }));
        }
      });
    });
  }

  trx(options?: any): Promise<IDBTransaction> {
    //pgerror stack trace not helpful in case of db error, so, we capture own stack tract
    //let possibleError = new Error();
    //Error.captureStackTrace(possibleError, this);

    return new Promise<IDBTransaction>((resolve, reject) => {
      pg.connect(this.config.connectionString, function(error, client, releaseClient) {
        if (error) {
          reject(error);
        } else {
          console.log()
          client.query('BEGIN', (err, result) => {
            resolve(new PGTransaction(client, releaseClient))
          })
        }
      });
    });
  }

  end() {
    pg.end();
  }
}
