const express = require('express');
const upload = require('../config/multerConfig');
const mediaController = require('../controllers/mediaController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/upload', requireAuth, upload.array('images', 10), mediaController.uploadImages);

module.exports = router;
