const config = require('../../../config');

const getProxyEnabled = (req, res) =>
  res.json({ proxyEnabled: config.proxy.isEnabled });

const getBase = (req, res) => {
  const baseConfig = {
    CDN_URL: `${config.cdnUrl}/spas/basespa`
  };
  return res.render('index', baseConfig);
};

const getGrades = (req, res) => {
  const { c, classId, studentId } = req.query;
  if (c) return res.redirect(`${config.baseUrl}/gradecheck/view?c=1`);
  let url = `${config.baseUrl}/gradecheck/view`;
  if (classId) {
    url += `?classId=${classId}`;
    if (studentId) url += `&studentId=${studentId}`;
    return res.redirect(url);
  }
  return res.redirect(`${config.baseUrl}/not-found`);
};

const getNotFound = (req, res) => {
  const notFoundConfig = {
    CDN_URL: `${config.cdnUrl}/spas/errorspa`
  };
  return res.render('index', notFoundConfig);
};

module.exports = { getProxyEnabled, getBase, getGrades, getNotFound };
