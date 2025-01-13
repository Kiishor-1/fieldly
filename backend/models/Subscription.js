const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    icon: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
