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
    webserver.post('/api/logout', this.logout.bind(this));    
    webserver.post('/api/me', this.me.bind(this));
    webserver.post('/api/tasks/find', this.tasksList.bind(this));
    webserver.post('/api/tasks/executors', this.executorsList.bind(this));
    webserver.post('/api/tasks/executors/update', this.updateExecutor.bind(this));
    webserver.post('/api/form/load', this.loadForm.bind(this));
    webserver.post('/api/form/save', this.saveForm.bind(this));
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
  async logout(req: Request, res: Response) {
    res.clearCookie('user');
    res.clearCookie('authprovider');
    res.status(200).end();
  }

  @wrapAsync
  async me(req: Request, res: Response) {
    if (!req.signedCookies || !req.signedCookies.user) {
      return res.json({});
    }
    var { db } = this.settings;
    let user_id = req.signedCookies.user;
    try {
      let user = await invoke(new GetUser({query: {id: user_id}, db}));
      let u: any = user;
      u.provider = req.signedCookies.authprovider;
      return res.json(u);
    } catch (e) {
      console.log('Invalid user cookie');
      res.clearCookie('user');
      res.clearCookie('authprovider');
      res.json({});
    }
  }

  @wrapAsync
  async tasksList(req: Request, res: Response) {
    setTimeout(() => {
      const {search} = req.body;
      if (search === 'fail') {
        return res.status(500).send('Test api error for search [fail]');
      }

      const terms = (search || '').split(' ');
      const matchedTasks = !terms.length ? this.tasks :
        this.tasks.filter(task => terms.some(term => task.id.toString() === term || task.title.indexOf(term) >= 0));
      res.json({
        tasks: matchedTasks,
        count: matchedTasks.length,
      });
    }, 1000);
  }

  @wrapAsync
  async executorsList(req: Request, res: Response) {
    setTimeout(() => {
      const {ids} = req.body;
      if (ids.some(id => id === 6)) {
        return res.status(500).send('Test api error for executor 6');
      }
      const matched = this.executors.filter(e => ids.some(id => id === e.id));
      res.json(matched);
    }, 1000);
  }

  @wrapAsync
  async updateExecutor(req: Request, res: Response) {
    setTimeout(() => {
      const {id, name} = req.body;

      const executor: any = this.executors.find(e => e.id === id);
      if (!executor) {
        return res.status(500).send('Unknown executor');
      }
      if (id === 5) {
        return res.status(500).send('Test api update error for executor #5');
      }

      executor.name = name;

      res.json(executor);
    }, 2000);
  }

  tasks: Array<{id: number, title: string, status: number, executors?: number[]}>;
  executors: Array<{id: number, name: string, tasks?: number[]}>;

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
    this.executors = [
      {id: 1, name: 'toby brian', tasks: [1, 6, 4, 34]},
      {id: 2, name: 'bobby patric', tasks: [6, 56, 77, 72]},
      {id: 3, name: 'genry south'},
      {id: 4, name: 'dobby potter', tasks: [98]},
      {id: 5, name: 'jillian donnald', tasks: [1, 6, 11, 22, 33, 44, 55, 66, 77, 88]},
      {id: 6, name: 'may flower', tasks: [4]},
    ];
    this.executors.forEach(executor => {
      if (Array.isArray(executor.tasks)) {
        executor.tasks.forEach(id => {
          const task: any = this.tasks.find(t => t.id === id);
          task.executors = task.executors || [];
          task.executors.push(executor.id);
        })
      }
    });
  }

  @wrapAsync
  async loadForm(req: Request, res: Response) {
    setTimeout(() => {
      const {id} = req.body;
      console.log(`Requested edit form ${id}`);

      const form = {
        id,
        name: 'Some form',
        description: 'Example editable form with description',
        validTill: new Date('2015-06-12'),
        typeCode: 'EFF',
        enabled: true,
      };

      res.json(form);
    }, 1000);
  }

  @wrapAsync
  async saveForm(req: Request, res: Response) {
    setTimeout(() => {
      const form = req.body;
      console.log(`Form to save: ${JSON.stringify(form, null, 2)}`);

      res.status(200).end();
    }, 1000);
  }

}
