const express = require('express');
const router = express.Router();
const Field = require('../models/Field');
const { generateAnalysis, userFieldsAnalysis, adminAnalyltics } = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware')
const { isAdmin } = require('../middlewares/isAdmin')
const { isUser } = require('../middlewares/isUser')

router.get('/', authMiddleware, isUser, userFieldsAnalysis);

router.get('/:id/generate-analysis', authMiddleware, isUser, generateAnalysis)

router.get('/admin-analytics', authMiddleware, isAdmin, adminAnalyltics)

module.exports = router;
