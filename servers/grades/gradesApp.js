const express = require('express');

const chalk = require('chalk');
const debug = require('debug')('gradesApp');

const app = express();
const routes = require('./routes');

app.set('views', './servers/grades/views');
app.set('view engine', 'pug');

app.use(routes);

module.exports = function gradesApp() {
  debug(`${chalk.yellow('Grades')} app is running...`);
  return app;
};
