const express = require('express');
const authController = require('../controllers');

const router = express.Router();

router.route('/').get(authController.isEnabled);
router.route('/health').get(authController.getHealth);
router.route('/signin').post(authController.signIn);
router.route('/signup').post(authController.signUp);
router.route('/logout').get(authController.logoutProfile);
router.route('/getpublickey').post(authController.getPublicKey);
router.route('/user').get(authController.getUser);

module.exports = router;
