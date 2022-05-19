require('dotenv').config();
const config = require('../config');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const jwtUtil = require('../utils/jwtUtil');
// eslint-disable-next-line no-unused-vars
const passport = require('passport');

const debug = require('debug')('mainApp');
const chalk = require('chalk');

const port = process.env.PORT;
const app = express();

app.use(morgan('common'));
app.use(express.static(path.resolve('', path.join(__dirname, '/../public'))));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'th1s1ss4mss3cr3t',
    saveUninitialized: false,
    resave: false
  })
);

app.set('views', './src/views');
app.set('view engine', 'pug');
require('../servers/auth/passport')(app);

app.use(['/auth', '/auth/*'], require('../servers/auth/authApp')());
app.use(['/cdn', '/cdn/*'], require('../servers/cdn/cdnApp')());
app.use(
  ['/gradecheck', '/gradecheck/*'],
  require('../servers/grades/gradesApp')()
);
app.use(['/proxy', '/proxy/*'], require('../servers/proxy/proxyApp')());

app.get('/user', (req, res) => {
  res.json(req.user);
});
app.get('/', (req, res) => {
  res.redirect(`${config.baseUrl}/home`);
});
app.get('*', (req, res) => {
  const safeUser = req.user
    ? JSON.stringify({
        username: req.user.username,
        name: req.user.name
      })
    : 'null';
  const pageConfig = {
    BASE_URL: config.baseUrl,
    CDN_URL: `${config.cdnUrl}/spas/alwaysonspa`,
    USER: safeUser
  };
  res.render('index', pageConfig);
});

const server = app.listen(port, () => {
  jwtUtil.makeJwk();
  debug(`Listening on port ${chalk.green(port)}...`);
});

module.exports = { app, server };
