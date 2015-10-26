import {Request, Response} from 'express';
import IService from './../../../framework/server/interfaces/IService';
import HTMLStab from './HTMLStab';
import reactServerRender from './reactServerRender';
import wrapAsync from './../../../framework/server/express/wrapAsync';

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

  this.webserver.get('/', this.render.bind(this));

  console.log(this.settings.name + ' started');
}

@wrapAsync
async render(req: Request, res: Response) {
  const { content, cachedump } = await reactServerRender(req.url);
  res.send(HTMLStab({content, cachedump}));
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
