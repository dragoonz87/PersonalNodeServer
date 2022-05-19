const express = require('express');
const apiRoutes = require('./apiRoutes');
const gradesRoutes = require('./gradesRoutes');

const router = express.Router();

router.use('/api', apiRoutes);
router.use(gradesRoutes);

module.exports = router;
