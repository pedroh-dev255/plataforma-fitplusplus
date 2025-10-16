const express = require('express');
const router = express.Router();
const { getEvents, createEvent, addPart } = require('../controllers/eventsController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.post('/getEvents', authMiddleware, getEvents);
router.post('/cadEvento', authMiddleware, createEvent);
router.post('/addPart', authMiddleware, addPart)

module.exports = router;