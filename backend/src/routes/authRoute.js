const express = require('express');
const router = express.Router();

const { login, register, reset, resetConfirm, validate } = require('../controllers/authController');
const authMiddleware = require('../../middlewares/authMiddleware');



// rotas
router.post('/login', login);
router.post('/register', register);

router.post('/validate-token', authMiddleware, validate);
router.post('/reset-password', reset);
router.post('/reset-password/confirm', resetConfirm);


module.exports = router;