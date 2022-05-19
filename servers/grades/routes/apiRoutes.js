const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.route('/classes').get(apiController.getClasses);
router.route('/:classId([0-9]+)').get(apiController.getStudents);
router
  .route('/:classId([0-9]+)/:studentId([0-9]+)')
  .get(apiController.getStudents);

module.exports = router;
