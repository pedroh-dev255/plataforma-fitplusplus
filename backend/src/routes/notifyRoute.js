const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { sendNotificationController, cadTokenFirebaseController, verifyController } = require('../controllers/notifyController');



router.post('/send', authMiddleware, sendNotificationController);
router.post('/cadTokenFirebase', authMiddleware, cadTokenFirebaseController);
router.get('/verify/:id', authMiddleware, verifyController);

module.exports = router;
