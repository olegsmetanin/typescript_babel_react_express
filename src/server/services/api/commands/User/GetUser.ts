import Command from './../../../../../framework/common/command/Command';
import {IQueryable} from './../../../../../framework/server/database/IDB';
import User from './../../../../../framework/common/user/User';
import queryBuilder from './../../../../../framework/server/database/queryBuilder';

interface IGetUserOptions {
  query: {id?: string, slug?: string, provider?: string, provider_id?: string};
  db: IQueryable;
}

export default class GetUser extends Command<Promise<User>> {

  className = 'GetUser';

  options: IGetUserOptions;

  constructor(options: IGetUserOptions) {
    super();
    this.options = options;
  }

  async execute() {
    const {query, db} = this.options;
    let qUsers = queryBuilder.select('users.*').from('users');
    if (query.id) {
      qUsers.where('users.id', query.id);
    } else if (query.slug) {
      qUsers.where('users.slug', query.slug);
    } else if (query.provider && query.provider_id) {
      qUsers
        .leftJoin('userauth', 'userauth.id', 'users.id')
        .where('userauth.provider', query.provider)
        .where('userauth.provider_id', query.provider_id)
    }
    const sql = qUsers.toString();
    //console.log('get users sql', sql);
    const rsUsers = (await db.query(sql)).rows;
    const user: User = rsUsers.length ? rsUsers[0] : null;
    return user;
  }

}
