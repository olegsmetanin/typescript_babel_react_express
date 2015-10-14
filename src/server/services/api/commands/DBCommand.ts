import ICommand from './../../../../framework/server/interfaces/ICommand';
import IDB from './../../../../framework/server/interfaces/IDB';


interface IDBCommandOptions {
  db: IDB;
}

export default class DBCommand implements ICommand<Promise<number>> {

  db: IDB;

  constructor(options: IDBCommandOptions) {
    this.db = options.db;
  }

  async execute() {
    return (await this.db.query('select 1 as q')).rows[0];
  }

}
