import IService from './../../../framework/server/interfaces/IService';
import HTMLStab from './HTMLStab';
import reactServerRender from './reactServerRender';


var wrap = fn => (...args) => fn(...args).catch(args[2]);

interface AppServiceSettings {
  name: string;
  webserver: any;
}

export default class AppService implements IService {

  settings: AppServiceSettings;
  webserver: any;

  constructor(settings: AppServiceSettings) {
    this.settings = settings;
    this.webserver = settings.webserver;
  }

  async start() {

  this.webserver.get('/', wrap(async(req, res, next) => {
    var { content, cachedump } = await reactServerRender(req.url);
    res.send(HTMLStab({content, cachedump}));
  }));

  console.log(this.settings.name + ' started');
}

async stop() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(this.settings.name + ' stopped');
      resolve();
    }, 1000);
  })
}
}
