const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription')
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const { subscriptions, createOrder, verifyPayment } = require('../controllers/subscriptionController');
const { isUser } = require('../middlewares/isUser');


router.get('/allSubscriptions', authMiddleware, isUser, subscriptions)
router.post('/createOrder', authMiddleware, isUser, createOrder);
router.post('/verify-payment', authMiddleware, isUser, verifyPayment)

module.exports = router;
