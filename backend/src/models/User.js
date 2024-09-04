const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type:String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
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
        idGoogle: {
            type: String,
        },
        loginMethod: {
            type: String,
            enum:['AUTHENTICATION', 'GOOGLE'],
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);