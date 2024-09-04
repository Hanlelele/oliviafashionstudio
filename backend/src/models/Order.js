const mongoose = require('mongoose');
//const moment = require('moment');

const orderSchema = new mongoose.Schema({   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    fullname: {
        type: String,
        require: true
    },

    phone: {
        type: String,
        require: true,
    },

    address: {
        type: String,
        require: true,
    },
    
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum:['CASH', 'PAYPAL'],
    },

    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING',
    },

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;