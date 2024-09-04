const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    code: {
        type: String,
        default: null
    }
},{ timestamps: true });

module.exports = mongoose.model('Account', accountSchema);