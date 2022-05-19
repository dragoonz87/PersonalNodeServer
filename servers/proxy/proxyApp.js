const express = require('express');

const debug = require('debug')('proxyApp');
const chalk = require('chalk');

const app = express();
const routes = require('./routes');

app.set('views', './servers/proxy/views');
app.set('view engine', 'pug');

app.use(routes);

module.exports = function proxyApp() {
  debug(`${chalk.grey('Proxy')} app is running...`);
  return app;
};
