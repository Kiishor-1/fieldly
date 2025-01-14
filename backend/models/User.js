const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
    },
    tokenVersion: {
        type: Number,
        default: 0,
    },
    subscribedSubscriptions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subscription',
        },
    ],
    fields: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Field',
        },
    ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
