const express = require('express');
const debug = require('debug')('authApp');
const chalk = require('chalk');

const app = express();
const routes = require('./routes');

app.use(routes);

module.exports = function authApp() {
  debug(`${chalk.redBright('Auth')} app running...`);
  return app;
};
