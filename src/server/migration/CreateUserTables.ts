import IDB from '../../framework/server/database/IDB';

interface ICreateUserTablesSettings {
  db: IDB;
  logger: any;
}

export default class CreateUserTables {

  settings: ICreateUserTablesSettings;

  constructor(settings: ICreateUserTablesSettings) {
    this.settings = settings;
  }

  async apply() {

    let { db, logger } = this.settings;

    await db.query(`create table users (
      id uuid not null,
      slug varchar(255) not null,
      first_name varchar(255) not null,
      last_name varchar(255) not null,
      email varchar(50) null,
      email_confirmed boolean not null default(false),
      phone varchar(20) null,
      phone_confirmed boolean not null default(false),
      created_at timestamp with time zone not null default now(),
      updated_at timestamp with time zone not null default now(),

      constraint pk_user primary key(id),
      constraint ck_user_email_unique unique(email)
    )`);

// user:{"id":"10207354992866639","displayName":"Oleg Smetanin","name":{},"provider":"facebook","_raw":"{\"name\":\"Oleg Smetanin\",\"id\":\"10207354992866639\"}","_json":{"name":"Oleg Smetanin","id":"10207354992866639"}}

    await db.query(`create table userauth (
      id uuid not null,
      provider varchar(255) not null,
      provider_id varchar(255) not null,
      created_at timestamp with time zone not null default now(),
      updated_at timestamp with time zone not null default now()
    )`);

    await db.query(`create table userpass (
      id uuid not null,
      hash varchar(255) not null,
      email_confirm_token uuid null,
      phone_confirm_token int null
    )`);

    logger.log('tables users, userauth, userpass created');

  }
}
