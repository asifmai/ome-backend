const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const genController = require('../controllers/genController');
const groupsController = require('../controllers/groupsController.js');
const passportService = require('../config/passport');

const login = passport.authenticate('local', { session: false });
const apiAuth = passport.authenticate('jwt', { session: false });

// Auth Routes
router.post('/auth/register-phone', authController.register_phone);
router.post('/auth/verify-phone', authController.verify_phone);
router.post('/auth/resend-code', authController.resend_code);
router.post('/auth/register', authController.register);
router.post('/auth/login', login, authController.login);

// Main Routes
router.get('/general', apiAuth, genController.route);

// Group Routes
router.get('/groups', apiAuth, groupsController.groups_get);
router.post('/groups/create-group', apiAuth, groupsController.create_group_post);
router.get('/groups/delete-group/:groupid', apiAuth, groupsController.delete_group_get);
router.post('/groups/update-group', apiAuth, groupsController.update_group_post);

module.exports = router;