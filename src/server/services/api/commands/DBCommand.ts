import Command from './../../../../framework/server/interfaces/Command';
import IDB from './../../../../framework/server/interfaces/IDB';


interface IDBCommandOptions {
  q: string;
  db: IDB;
}

export default class DBCommand extends Command<Promise<any>> {

  className = 'DBCommand';

  options: IDBCommandOptions;

  constructor(options: IDBCommandOptions) {
    super();
    this.options = options;
  }

  async execute() {
    var {q, db} = this.options;
    return (await db.query(q)).rows;
  }

}
