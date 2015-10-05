import ServiceInterface from './../../interfaces/ServiceInterface';

export default class APIService implements ServiceInterface {

  constructor() {

  }

  async start() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('API Service started');
        resolve();
      }, 1000);
    })
  }

  async stop() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('API Service stopped');
        resolve();
      }, 1000);
    })
  }
}
