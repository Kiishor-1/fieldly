var express = require('express');
var router = express.Router();
var Field = require('../models/Field');
const { generateAnalysis, userFieldsAnalysis } = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, userFieldsAnalysis);

router.get('/:id/generate-analysis', authMiddleware, generateAnalysis)

module.exports = router;
