const Razorpay = require('razorpay');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});


const subscriptions = async (req, res) => {
    console.log('Request received');

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('subscribedSubscriptions');

        console.log('Fetched User:', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userSubscriptionsId = user.subscribedSubscriptions.map((sub) => sub._id.toString());
        console.log('User Subscription IDs:', userSubscriptionsId);


        const allSubscriptions = await Subscription.find();
        console.log('All Subscriptions:', allSubscriptions);


        const userSubscriptions = allSubscriptions.filter((sub) => 
            userSubscriptionsId.includes(sub._id.toString())
        );

        const availableSubscriptions = allSubscriptions.filter(
            (sub) => !userSubscriptionsId.includes(sub._id.toString())
        );

        console.log('User Subscriptions:', userSubscriptions);
        console.log('Available Subscriptions:', availableSubscriptions);


        res.status(200).json({ userSubscriptions, availableSubscriptions });
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Error fetching subscriptions', error });
    }
};


const createOrder = async (req, res) => {
    const { amount, subscriptionId } = req.body;
    const userId = req.user.id; // Assuming userId is available in `req.user`

    if (!amount || !subscriptionId) {
        return res.status(400).json({ error: 'Amount and Subscription ID are required' });
    }

    try {
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const options = {
            amount: amount * 100, // amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
};

const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;
    const userId = req.user.id; // Assuming userId is available in `req.user`

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !subscriptionId) {
        return res.status(400).json({ error: 'All payment verification fields are required' });
    }

    try {
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            const subscription = await Subscription.findById(subscriptionId);
            if (!subscription) {
                return res.status(404).json({ error: 'Subscription not found' });
            }

            await User.findByIdAndUpdate(userId, {
                $addToSet: { subscribedSubscriptions: subscriptionId }
            });

            res.json({ success: true, message: 'Subscription payment verified and updated successfully' });
        } else {
            res.status(400).json({ success: false, error: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, error: 'Payment verification failed' });
    }
};

module.exports = {
    subscriptions,
    createOrder,
    verifyPayment
}