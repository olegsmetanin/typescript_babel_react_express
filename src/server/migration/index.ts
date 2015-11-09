import PG from '../../framework/server/database/PG';
import CreateDatabase from './CreateDatabase';
import CreateUserTables from './CreateUserTables';

interface IMigratorSettings {
  config: any;
  logger: any;
}

export default class Migrator {

  settings: IMigratorSettings;

  constructor(settings: IMigratorSettings) {
    this.settings = settings;
  }

  async init() {
    let { config, logger } = this.settings;
    await ((new CreateDatabase({ config, logger })).apply());
    let connectionString = config.db.main;
    let db = new PG({ connectionString });
    await ((new CreateUserTables({ db, logger })).apply());
    db.end();

    //console.log('Migrator init');

    //let db =
    //await CreateUsersTables()
  }
}
