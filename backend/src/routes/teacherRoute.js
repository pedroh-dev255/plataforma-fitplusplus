const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {getAlunos} = require('../controllers/teacherController');


router.post('/getAlunos', authMiddleware, getAlunos);



module.exports = router;