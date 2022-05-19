const express = require('express');
const debug = require('debug')('cdnApp');
const chalk = require('chalk');
const path = require('path');

const app = express();
const routes = require('./routes');

app.use(express.static(path.resolve('', path.join(__dirname, '/files'))));

app.use(routes);

module.exports = function cdnApp() {
  debug(`${chalk.blueBright('CDN')} app running...`);
  return app;
};
