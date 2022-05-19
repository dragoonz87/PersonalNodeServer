const config = require('../../../config');
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('gradesApp:gradesController');

const getGradeCheckEnabled = (req, res) =>
  res.json({ gradeCheckEnabled: config.gradeCheck.isEnabled });

const getHealth = (req, res) => res.send('Grades is running');

const renderSpa = (req, res) => {
  const gradesConfig = {
    CDN_URL: `${config.cdnUrl}/spas/gradecheckspa`,
    WINDOW_PATH: req.path
  };
  return res.render('index', gradesConfig);
};

const authorize = (req, res, next) => {
  if (req.user) return next();
  return res.redirect(`${config.baseUrl}/proxy/signin`);
};

module.exports = { authorize, getGradeCheckEnabled, getHealth, renderSpa };
