import Command from './../../../../../framework/common/command/Command';
import IDB from './../../../../../framework/server/database/IDB';
import User from './../../../../../framework/common/user/User';
import queryBuilder from './../../../../../framework/server/database/queryBuilder';

interface IGetUserOptions {
  query: {id?: string, slug?: string, provider?: string, provider_id?: string};
  db: IDB;
}

export default class GetUser extends Command<Promise<User>> {

  className = 'GetUser';

  options: IGetUserOptions;

  constructor(options: IGetUserOptions) {
    super();
    this.options = options;
  }

  async execute() {
    let {query, db} = this.options;
    var qUsers = queryBuilder.select('*').from('users');
    if (query.id) {
      qUsers.where('id', query.id);
    } else if (query.slug) {
      qUsers.where('slug', query.slug);
    } else if (query.provider && query.provider_id) {
      qUsers
        .leftJoin('userauth', 'userauth.id', 'users.id')
        .where('userauth.provider', query.provider)
        .where('userauth.provider_id', query.provider_id)
    }
    var rsUsers = (await db.query(qUsers.toString())).rows;
    var user: User = rsUsers.length ? rsUsers[0] : null;
    return user;
  }

}
