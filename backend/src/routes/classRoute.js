const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { createClass, getAllClass, getClass } = require('../controllers/classController');


router.post('/create', authMiddleware, createClass);
router.get('/', authMiddleware, getAllClass);
router.post('/getClass', authMiddleware, getClass);

module.exports = router;