import {Request, Response} from 'express';
import wrapAsync from './../../../framework/server/express/wrapAsync';
import invoke from './../../../framework/server/invoke/invoke';
import Delay from './../../../framework/common/commands/Delay';

interface APIRoutesSettings {
  webserver: any;
}

export default class APIRoutes {

  settings: APIRoutesSettings;

  constructor(settings: APIRoutesSettings) {
    this.settings = settings;
  }

  setup() {
    const {webserver} = this.settings;

    webserver.post('/api/echo', this.echo.bind(this));
    webserver.post('/api/delay', this.delay.bind(this));
    webserver.post('/api/throw', this.throwApiError.bind(this));
    webserver.post('/api/authonly', this.authonly.bind(this));
    webserver.post('/api/login', this.login.bind(this));
  }

  @wrapAsync
  async echo(req: Request, res: Response) {
    res.send(req.body);
  }

  @wrapAsync
  async delay(req: Request, res: Response) {
    await(invoke(new Delay(1000)));
    res.send(req.body);
  }

  @wrapAsync
  async throwApiError(req: Request, res: Response) {
    //console.log('this', this);
    throw new Error('Test api error');
  }

  /**
   * Return 401, if not authorized
   * @param req
   * @param res
   */
  @wrapAsync
  async authonly(req: Request, res: Response) {
    if (!req.signedCookies || !req.signedCookies.user) {
      return res.status(401).send('Authentication required. Please, login before');
    }

    res.json({ok: true});
  }

  @wrapAsync
  async login(req: Request, res: Response) {
    res.cookie('user', 'toby', {
      signed: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, //1 year
      httpOnly: true
    });
    res.status(200).end();
  }

}
