import ISystem from './interfaces/ISystem';

import IService from './interfaces/IService';
import APIService from './services/api/APIService';

import ILogger from './interfaces/ILogger';
import DefaultLogger from './logger/DefaultLogger';

export default class Server {

  apiService: IService;
  logger: ILogger;

  constructor(settings: any, config: any) {
    this.system = system;
    this.apiService = new APIService(system);
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
