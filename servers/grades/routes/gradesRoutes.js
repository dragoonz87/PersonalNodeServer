const express = require('express');
const gradesController = require('../controllers/gradesController');

const router = express.Router();

router.route('/').get(gradesController.getGradeCheckEnabled);
router.route('/health').get(gradesController.getHealth);
router.use(gradesController.authorize);
router
  .route(['/view', '/classes', '/:classId', '/:classId/:studentId'])
  .get(gradesController.renderSpa);

module.exports = router;
