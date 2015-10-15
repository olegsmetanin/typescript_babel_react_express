/// <reference path="../server.d.ts"/>
/// <reference path="../../../../typings/pg/pg.d.ts"/>

import IDB, {IDBClient} from './../interfaces/IDB';

var pg = require('pg'); // needed for Babel transpilation

interface IPG_Config {
  connectionString: string;
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
}
