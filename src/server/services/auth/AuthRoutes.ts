import {Request, Response} from 'express';
import wrapAsync from './../../../framework/server/express/wrapAsync';
import invoke from './../../../framework/server/invoke/invoke';
import IDB from './../../../framework/server/database/IDB';
import PasswordUtils from './../../../framework/server/password/PasswordUtils';
import GetUser from '../api/commands/User/GetUser';
import NewUser from '../api/commands/User/NewUser';
import ClosePopup from './ClosePopup';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

interface AuthRoutesSettings {
  config: any;
  webserver: any;
  db: IDB;
  passwordUtils: PasswordUtils;
}

export default class AuthRoutes {

  settings: AuthRoutesSettings;

  constructor(settings: AuthRoutesSettings) {
    this.settings = settings;
  }

  setup() {
    var { webserver, config, db, passwordUtils } = this.settings;

    passport.use(new FacebookStrategy({
        clientID: config.oauth.facebook.facebook_api_key,
        clientSecret: config.oauth.facebook.facebook_api_secret,
        callbackURL: '/auth/facebook/callback'
      },

      function(accessToken, refreshToken, profile, done) {

        console.log("fbuser:"+JSON.stringify(profile));

        var run = async () => {
          var user = await invoke(new GetUser({query: {provider: 'fb', provider_id: profile.id}, db}));
          console.log("user:"+JSON.stringify(user));
          if (user) {
            return done(null, user);
          } else {
            console.log('Create new user');
            user = await invoke(new NewUser({first_name: 'SOA', last_name: 'SOA', provider: 'fb', provider_id: profile.id, db, passwordUtils}));
            console.log('New user:', user);
            return done(null, user)
          }
        }

        try {
          run().catch(console.error);
        } catch (e) {
          console.log(e);
        }
        // process.nextTick(function () {
        //   //Check whether the User exists or not using profile.id
        //   //Further DB code.
        //   profile.user_id="00000444000555";
        //   return done(null, profile);
        // });

      }
    ));

    passport.serializeUser(function(user, done) {
      console.log('passport.serializeUser', user);
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      console.log('passport.deserializeUser', id);
        done(null, {id})
      // User.findById(id, function(err, user) {
      //   done(err, user);
      // });
    });

    webserver.use(passport.initialize());
    webserver.use(passport.session());
    webserver.get('/auth/closepopup', (req, res) => res.send(ClosePopup()));
    webserver.get('/auth/facebook', passport.authenticate('facebook', {session: false, scope: []}));
    webserver.get('/auth/facebook/callback',
      passport.authenticate('facebook', { session: false, failureRedirect: '/auth/closepopup' }),
      (req, res) => {
        console.log('auth user:', req.user);
        res.cookie('user', 'toby', {
          signed: true,
          maxAge: 365 * 24 * 60 * 60 * 1000, //1 year
          httpOnly: true
        });
        res.redirect('/auth/closepopup');
        //res.status(200).end();
     }
    );
  }

}
