const express = require('express');
const userControl = require('../Controllers/User');
const router = express.Router();

router.route('/signUp').post(userControl.signUp);
router.route('/login').post(userControl.login);

module.exports = router;
