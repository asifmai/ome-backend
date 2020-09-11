const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const genController = require('../controllers/genController');
const passportService = require('../config/passport');

const login = passport.authenticate('local', { session: false });
const apiAuth = passport.authenticate('jwt', { session: false });

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', login, authController.login);
router.post('/auth/verifyphone', authController.verifyPhone);

// Main Routes
router.post('/general', apiAuth, genController.route)

module.exports = router;