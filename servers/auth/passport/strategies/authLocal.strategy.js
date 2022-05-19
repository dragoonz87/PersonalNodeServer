const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const chalk = require('chalk');
const debug = require('debug')('authApp:localStrategy');

module.exports = function localStrategy() {
  passport.use(
    'auth-local',
    new Strategy(
      {
        usernameField: 'iusn',
        passwordField: 'ipwd'
      },
      (username, password, done) => {
        const url =
          'mongodb+srv://drag:R42dRyQGD3gKURN@sauster.bhimc.mongodb.net/Sauster?retryWrites=true&w=majority';
        const dbName = 'satabase';

        (async function authenticate() {
          let client;
          try {
            client = await MongoClient.connect(url);
            debug(`${chalk.green('Connected')} to ${chalk.cyan('mongo DB')}`);

            const db = client.db(dbName);
            const user = await db.collection('users').findOne({ username });
            if (user && password === user.password) {
              done(null, user);
            } else {
              done(null, false);
            }
          } catch (err) {
            debug(
              `Could not ${chalk.red('connect')} to ${chalk.cyan('mongo DB')}`
            );
            done(err, false);
          }
          client.close();
          debug(`Closed ${chalk.cyan('client')}`);
        })();
      }
    )
  );
};
