const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');

const { getSalas, getChat, SendText } = require('../controllers/forumController');


router.get('/getSalas', authMiddleware, getSalas);
router.post('/getChat', authMiddleware, getChat);
router.post('/sendMessage', authMiddleware, SendText);


module.exports = router