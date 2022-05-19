const express = require('express');
const proxyController = require('../controllers');

const router = express.Router();

router.route('/').get(proxyController.getProxyEnabled);
router
  .route(['/home', '/profile', '/signin', '/signup'])
  .get(proxyController.getBase);
router.route('/grades').get(proxyController.getGrades);
router.route('*').get(proxyController.getNotFound);

module.exports = router;
