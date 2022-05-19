const config = require('../../../config');
const debug = require('debug')('authApp:controller');
const passport = require('passport');
const jose = require('jose');
const { getPublicJwk, getPrivateJwk } = require('../../../utils/jwtUtil');

const isEnabled = (req, res) =>
  res.json({ authEnabled: config.auth.isEnabled });

const getHealth = (req, res) => res.send('Auth is running');

const handlePassportAuthenticate =
  // eslint-disable-next-line no-unused-vars
  (req, res, next, errMsg) => (err, user, info) => {
    if (err) {
      debug(err);
      return next(err);
    }
    if (!user) {
      const message = errMsg;
      return res.status(401).json({ message });
    }
    return req.logIn(user, (error) => {
      if (error) {
        debug(error);
        return next(error);
      }
      return res.sendStatus(204);
    });
  };

const signIn = async (req, res, next) => {
  try {
    const token = req.get('Authorization').split(' ')[1];
    const { payload } = await jose.jwtDecrypt(token, await getPrivateJwk(), {
      issuer: 'sb:spa.base'
    });
    req.body.iusn = payload.username;
    req.body.ipwd = payload.password;
  } catch (error) {
    debug(error);
    return res.status(401).json({
      error: 401,
      message: 'Invalid authorization'
    });
  }
  if (req.body?.test) {
    return res.json({
      username: req.body.iusn,
      password: req.body.ipwd !== undefined && req.body.ipwd !== null
    });
  }
  return passport.authenticate(
    'auth-local',
    handlePassportAuthenticate(
      req,
      res,
      next,
      'Incorrect login or account does not exist'
    )
  )(req, res, next);
};

const signUp = async (req, res, next) => {
  try {
    const token = req.get('Authorization').split(' ')[1];
    const { payload } = await jose.jwtDecrypt(token, await getPrivateJwk(), {
      issuer: 'sb:spa.base'
    });
    req.body.uusn = payload.username;
    req.body.unme = payload.name;
    req.body.upwd = Buffer.from(payload.password, 'base64').toString();
  } catch (error) {
    debug(error);
    return res.status(401).json({
      error: 401,
      message: 'Invalid authorization'
    });
  }
  if (req.body?.test) {
    return res.json({
      username: req.body.uusn,
      name: req.body.unme,
      password: req.body.upwd !== undefined && req.body.upwd !== null
    });
  }
  return passport.authenticate(
    'avail-local',
    handlePassportAuthenticate(req, res, next, 'Account already exists')
  )(req, res, next);
};

const getUser = (req, res) => {
  return res.json(
    req.user
      ? {
          username: req.user.username,
          name: req.user.name
        }
      : null
  );
};

const logoutProfile = (req, res) => {
  req.logout();
  res.redirect('/');
};

const validateAuthenticity = (req, res, next) => {
  if (req.user) return next();
  req.session.tp = req.originalUrl;
  return res.redirect('/signin');
};

const getPublicKey = async (req, res) => {
  if (req.body?.issuer !== 'sb:valid')
    return res.status(403).send('You cannot make this request');
  return res.json({ key: await jose.exportSPKI(await getPublicJwk()) });
};

module.exports = {
  isEnabled,
  getHealth,
  signIn,
  signUp,
  getUser,
  logoutProfile,
  authorize: validateAuthenticity,
  getPublicKey
};
