const express = require('express');
const cdnController = require('../controllers');

const router = express.Router();

router.route('/').get(cdnController.getCdnEnabled);
router.route('/health').get(cdnController.getHealth);
router.route('*').all(cdnController.getNonStatic);

module.exports = router;
