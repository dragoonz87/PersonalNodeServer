const config = require('../../../config');

const getCdnEnabled = (req, res) =>
  res.json({ cdnEnabled: config.cdn.isEnabled });

const getHealth = (req, res) => res.send('CDN is running');

const getNonStatic = (req, res) => res.status(400).send('File does not exist');

module.exports = {
  getCdnEnabled,
  getHealth,
  getNonStatic
};
