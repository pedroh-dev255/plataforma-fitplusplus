const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('../controllers/eventsController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.post('/getEvents', authMiddleware, getEvents);
router.post('/cadEvento', authMiddleware, createEvent);

module.exports = router;