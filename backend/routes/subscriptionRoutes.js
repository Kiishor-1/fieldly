const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription')
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const { subscriptions, createOrder, verifyPayment } = require('../controllers/subscriptionController');


router.get('/allSubscriptions', authMiddleware, subscriptions)
router.post('/createOrder', authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware, verifyPayment)

module.exports = router;
