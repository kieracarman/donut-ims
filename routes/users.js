const { Router } = require('express');

const router = Router();

const usersController = require('../controllers/users');

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', usersController.login);

module.exports = router;
