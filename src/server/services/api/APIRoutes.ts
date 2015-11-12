import {Request, Response} from 'express';
import wrapAsync from './../../../framework/server/express/wrapAsync';
import invoke from './../../../framework/server/invoke/invoke';
import Delay from './../../../framework/common/commands/Delay';
import GetUser from './commands/User/GetUser';
import IDB from './../../../framework/server/database/IDB';

interface APIRoutesSettings {
  webserver: any;
  db: IDB;
}

export default class APIRoutes {

  settings: APIRoutesSettings;

  constructor(settings: APIRoutesSettings) {
    this.settings = settings;

    this._generateStubData();
  }

  setup() {
    const {webserver} = this.settings;

    webserver.post('/api/echo', this.echo.bind(this));
    webserver.post('/api/delay', this.delay.bind(this));
    webserver.post('/api/throw', this.throwApiError.bind(this));
    webserver.post('/api/authonly', this.authonly.bind(this));
    webserver.post('/api/login', this.login.bind(this));
    webserver.post('/api/me', this.me.bind(this));
    webserver.post('/api/tasks/find', this.tasksList.bind(this));
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

  @wrapAsync
  async me(req: Request, res: Response) {
    if (!req.signedCookies || !req.signedCookies.user) {
      return res.json({});
    }
    var { db } = this.settings;
    let user_id = req.signedCookies.user;
    let user = await invoke(new GetUser({query: {id: user_id}, db}));
    let u: any = user;
    u.provider = req.signedCookies.authprovider;
    return res.json(u);
  }

  @wrapAsync
  async tasksList(req: Request, res: Response) {
    setTimeout(() => {
      const {search} = req.body;
      const terms = (search || '').split(' ');
      const matchedTasks = !terms.length ? this.tasks :
        this.tasks.filter(task => terms.some(term => task.id.toString() === term || task.title.indexOf(term) >= 0));
      res.json({
        tasks: matchedTasks,
        count: matchedTasks.length,
      });
    }, 1000);
  }

  tasks: Array<{id: number, title: string, status: number}>;
  executors: Array<number>;

  private _generateStubData() {
    const statuses = [1, 2, 3];
    const prefixes = ['Ongoing', 'Urgent', 'Decliend', 'Some example', 'Low level prioritized']
    this.tasks = [];
    for(let i = 0; i < 100; ++i) {
      this.tasks.push({
        id: i,
        title: `${prefixes[Math.floor(Math.random() * prefixes.length)]} task`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }
    //TODO executors
  }

}
