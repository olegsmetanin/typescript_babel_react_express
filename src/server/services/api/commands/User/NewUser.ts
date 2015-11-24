import Command from './../../../../../framework/common/command/Command';
import IDB from './../../../../../framework/server/database/IDB';
import User from './../../../../../framework/common/user/User';
import queryBuilder from './../../../../../framework/server/database/queryBuilder';
var uuid = require('node-uuid');
import PasswordUtils from './../../../../../framework/server/password/PasswordUtils';
import GetUser from './GetUser';
import invoke from './../../../../../framework/server/invoke/invoke';

interface INewUserOptions {
  first_name: string;
  last_name: string;
  provider: string;
  provider_id: string;
  db: IDB;
  passwordUtils: PasswordUtils;
  picurl: string;
}

export default class NewUser extends Command<Promise<User>> {

  className = 'NewUser';

  options: INewUserOptions;

  constructor(options: INewUserOptions) {
    super();
    this.options = options;
  }

  async execute() {
    const {first_name, last_name, provider, provider_id, picurl, db, passwordUtils} = this.options;

    const trx = await db.begin();
    try {
      let id:string = uuid.v4();

      const sqlInsUser = queryBuilder.insert({id, slug: id, first_name, last_name, picurl}).into('users').toString();
      await trx.query(sqlInsUser);

      const sqlInsAuth = queryBuilder.insert({id, provider, provider_id}).into('userauth').toString();
      await trx.query(sqlInsAuth);

      const {hash} = await passwordUtils.hash(uuid.v4());

      const sqlInsPass = queryBuilder .insert({id, hash}).into('userpass').toString();
      await trx.query(sqlInsPass);

      await trx.commit();

      return await invoke(new GetUser({query: {id}, db: trx}));
    } catch(e) {
      await trx.rollback();
      throw e;
    }
  }

}
