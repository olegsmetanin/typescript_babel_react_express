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
}

export default class NewUser extends Command<Promise<User>> {

  className = 'NewUser';

  options: INewUserOptions;

  constructor(options: INewUserOptions) {
    super();
    this.options = options;
  }

  async execute() {
    let {first_name, last_name, provider, provider_id, db, passwordUtils} = this.options;

    var trx = await db.trx();

    let id: string = uuid.v4();

    var qUsers = queryBuilder
      .insert({
        id,
        slug: id,
        first_name,
        last_name,
      })
      .into('users').toString();

    await trx.query(qUsers);

    var qUserAuth = queryBuilder
      .insert({
        id,
        provider,
        provider_id,
      })
      .into('userauth').toString();

    await trx.query(qUserAuth);

    let { hash, salt } = await passwordUtils.hash(uuid.v4());

    var qUserPass = queryBuilder
      .insert({
        id,
        hash
      })
      .into('userpass').toString();

    await trx.query(qUserPass);

    await trx.commit();
    
    return await invoke(new GetUser({query:{id}, db}));
  }

}
