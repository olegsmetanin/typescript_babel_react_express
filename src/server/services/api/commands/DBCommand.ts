import Command from './../../../../framework/common/command/Command';
import IDB from './../../../../framework/server/database/IDB';


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
