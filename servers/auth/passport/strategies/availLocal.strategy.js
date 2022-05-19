const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const chalk = require('chalk');
const debug = require('debug')('app:availLocalStrategy');

module.exports = function localStrategy() {
  passport.use(
    'avail-local',
    new Strategy(
      {
        usernameField: 'uusn',
        passwordField: 'upwd',
        passReqToCallback: true
      },
      (req, username, password, done) => {
        const url =
          'mongodb+srv://drag:R42dRyQGD3gKURN@sauster.bhimc.mongodb.net/Sauster?retryWrites=true&w=majority';
        const dbName = 'satabase';

        (async function attemptAddUser() {
          let client;
          try {
            client = await MongoClient.connect(url);
            debug(`${chalk.green('Connected')} to ${chalk.cyan('mongo DB')}`);

            const db = client.db(dbName);
            const user = await db.collection('users').findOne({ username });
            debug(user);
            if (!user) {
              const encodedPassword = Buffer.from(password).toString('base64');
              const name = req.body.unme;
              await db.collection('users').insertOne({
                username,
                name,
                password: encodedPassword
              });
              const newUser = { username, name, password: encodedPassword };
              done(null, newUser);
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
