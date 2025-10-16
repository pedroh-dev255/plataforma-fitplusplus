const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {getAlunos, getAv} = require('../controllers/teacherController');


router.post('/getAlunos', authMiddleware, getAlunos);
router.post('/getAv', authMiddleware, getAv)


module.exports = router;