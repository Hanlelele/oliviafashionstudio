var mongoose = require('mongoose');

var schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },

        discountPercentage: {
            type: Number,
            require: true
        }
    }
);

var Coupons = mongoose.model('Coupon', schema, 'coupon');

module.exports = Coupons;