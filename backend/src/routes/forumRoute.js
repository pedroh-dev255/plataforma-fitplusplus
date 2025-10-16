const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');

const { getSalas } = require('../controllers/forumController');


router.get('/getSalas', authMiddleware, getSalas);