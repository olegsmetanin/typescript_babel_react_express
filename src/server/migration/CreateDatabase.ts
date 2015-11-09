import PG from '../../framework/server/database/PG';

interface ICreateDatabaseSettings {
  config: any;
  logger: any;
}

export default class CreateDatabase {

  settings: ICreateDatabaseSettings;

  constructor(settings: ICreateDatabaseSettings) {
    this.settings = settings;
  }

  async apply() {
    let { config, logger } = this.settings;
    let connectionString = config.db.master;
    let db = new PG({ connectionString });
    let dbname = config.db.main.split('/').pop();

    logger.log('Running migration with db drop/create');
    logger.log('Connect to master ' + config.db.master);

    //knex escaping issue, we need use old compatibility mode for pg
    //https://github.com/tgriesser/knex/issues/828
    //https://github.com/tgriesser/knex/issues/658
    //https://github.com/tgriesser/knex/pull/886
    await db.query('alter system set standard_conforming_strings=false');
    await db.query('select pg_reload_conf()')
    var isDbExists = await db.query('select exists(select * from pg_database where datname=$1)', [dbname]);
    if (isDbExists.rows[0].exists) {
      logger.log('%s db exists, termitate connections and drop database next', dbname);
      await db.query('select pg_terminate_backend(pg_stat_activity.pid) from pg_stat_activity where pg_stat_activity.datname=$1', [dbname]);
      await db.query('drop database ' + dbname);
      logger.log('%s db dropped', dbname);
    }
    logger.log('Create database %s', dbname);
    await db.query(`CREATE DATABASE ` + dbname +
      ` WITH OWNER = postgres
        ENCODING = \'UTF8\'
        TABLESPACE = pg_default
        LC_COLLATE = \'en_US.utf8\'
        LC_CTYPE = \'en_US.utf8\'
        CONNECTION LIMIT = -1;`);

    logger.log('%s db created', dbname);

    db.end();
  }
}
