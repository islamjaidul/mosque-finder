const express = require('express');
const router = express.Router();

const Auth = require('../controllers/AuthController');

router.post('/register', Auth.register);
router.post('/login', Auth.loggedIn);

module.exports = router;