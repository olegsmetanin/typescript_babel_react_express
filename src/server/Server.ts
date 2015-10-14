import IService from './../framework/server/interfaces/IService'
import APIService from './services/api/APIService';
import PG from './../framework/server/database/PG';

export default class Server {

  apiService: IService;

  constructor() {
    this.apiService = new APIService({name: 'API Service', db: new PG({connectionString: 'postgres://postgres:mysecretpassword@192.168.99.100/ts'})});
  }

  async start() {
    console.log('Start server');
    await this.apiService.start();
  }

  async stop() {
    await this.apiService.stop();
    console.log('Start stopped');
  }
}
