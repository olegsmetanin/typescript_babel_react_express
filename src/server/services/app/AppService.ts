import {Request, Response} from 'express';
import IService from './../../../framework/server/interfaces/IService';
import HTMLStab from './HTMLStab';
import reactServerRender from './reactServerRender';
import wrapAsync from './../../../framework/server/express/wrapAsync';

interface AppServiceSettings {
  webserver: any;
  siteroot: string;
}

export default class AppService implements IService {

  settings: AppServiceSettings;
  webserver: any;

  constructor(settings: AppServiceSettings) {
    this.settings = settings;
    this.webserver = settings.webserver;
  }

  async start() {

  this.webserver.get('*', this.render.bind(this));

  console.log('AppService started');
}

@wrapAsync
async render(req: Request, res: Response) {
  const { content, cachedump, status } = await reactServerRender(req.url, this.settings.siteroot);
  res.status(status).send(HTMLStab({content, cachedump}));
}

async stop() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('AppService stopped');
      resolve();
    }, 1000);
  })
}
}
