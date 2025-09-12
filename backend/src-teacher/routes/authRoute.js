const express = require('express');
const router = express.Router();
const {login, register, validate} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/login', login);
router.post('/register', register);
router.post('/validate-token', authMiddleware, validate);


module.exports = router;