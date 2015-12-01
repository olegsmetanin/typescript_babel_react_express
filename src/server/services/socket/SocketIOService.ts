import {RequestHandler} from 'express';
import {Server} from 'http';
const io =  require('socket.io');
import IService from '../../../framework/server/interfaces/IService';
import IEventBus from '../../../framework/common/event/IEventBus';
import ToUserEvent from './ToUserEvent';


interface ISocketIOServiceSettings {
  eventBus     : IEventBus;
  socketPath   : string;
  server       : Server;
  cookieParser : RequestHandler;
}

export default class SocketIOService implements IService {

  private settings: ISocketIOServiceSettings;
  private userSockets: {[userId: string]: SocketIO.Socket[]};
  private iosrv: SocketIO.Server;

  constructor(settings: ISocketIOServiceSettings) {
    this.settings = settings;
    this.userSockets = {};
  }

  async start() {
    const {server, cookieParser, eventBus, socketPath} = this.settings;
    const iosrv: SocketIO.Server = io(server, {path: socketPath});
    this.iosrv = iosrv;

    //use parser for signed cookies from our express server
    iosrv.use((socket, next) => {
      cookieParser(socket.request, null, next);
    });

    //check if we know current user after cookieParser work
    iosrv.use((socket, next) => {
      console.log('second use');
      if (!socket.request.signedCookies || !socket.request.signedCookies.user) {
        //no user - no socket.io
        //https://github.com/socketio/socket.io/issues/1720
        socket.disconnect(true);
        return next(new Error('Authentication error'));
      }

      next();
    });

    //main client->server logic
    iosrv.on('connection', (socket: SocketIO.Socket) => {
      const user = socket.request.signedCookies.user;

      if (!user) {
        //TODO log with winston as warning
        return console.log('No user - no socket.io');
      }

      //TODO log with winston as trace/debug
      console.log(`Hi to new socket.io user ${user}`);

      this.userSockets[user] = this.userSockets[user] || [];
      this.userSockets[user].push(socket);

      socket.on('toServer', function (data) {
        console.log('toServer', data);

        this.eventBus.emit(data);
      });
      //now we support only client -> toServer -> server events
      //socket.on('toUser', function (data) {
      //  eventBus.emit('toUser', data);
      //});

      socket.on('disconnect', () => {
        const socks = this.userSockets[user];
        if (socks) {
          const index = socks.indexOf(socket);
          if (index >= 0) socks.splice(index, 1);
          if (!socks.length) delete this.userSockets[user];
        }
      });
    });

    //main server->client logic
    eventBus.on<ToUserEvent>(ToUserEvent.type, (evt: ToUserEvent) => {
      try {
        if (evt.user && evt.user.length) {
          //this is broadcast message to all users
          iosrv.emit('notify', evt.data);
          return;
        }

        //else this is personal message for user
        const {user} = evt;
        if (!this.userSockets[user]) {
          //TODO log with winston as trace
          console.log(`User ${user} not connected, discard message`, evt);
          return;
        }

        for(let i = 0; i < this.userSockets[user].length; ++i) {
          this.userSockets[user][i].emit('notify', evt);
        }
      } catch(err) {
        console.log('Socket service. Error emit msg to user', evt);
      }
    });

    console.log('SocketIOService started');
  }

  async stop() {
    if (Object.keys(this.userSockets).length) {
      for(let user in this.userSockets) {
        const socks = this.userSockets[user];
        if (socks && socks.length) {
          socks.forEach(socket => socket.disconnect(true));
        }
      }
    }
    this.userSockets = {};
    this.iosrv.close();

    console.log('SocketIOService stopped');
  }

}
