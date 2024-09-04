var mongoose = require('mongoose');

var schema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true
        },
        banner: {
            type: String,
            required: true
        },
        icon: {
            type: String,
        }
    }
);

var Category = mongoose.model('Category', schema, 'category');

module.exports = Category;