const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { login, register, reset, resetConfirm, validate } = require('../controllers/authController');
const authMiddleware = require('../../middlewares/authMiddleware');

// 📦 configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/profile');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// rotas
router.post('/login', login);
router.post('/register', upload.single('photo'), register);

router.post('/validate-token', authMiddleware, validate);
router.post('/reset-password', reset);
router.post('/reset-password/confirm', resetConfirm);


module.exports = router;