const User = require('../models/User')
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const loginSuccess = async (req, res) => {
    const { userId } = req?.body;
    try {
        if (!userId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing inputs',
            });
        }

        const response = await User.findOne({ idGoogle: userId });

        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const token = jwt.sign(
            {
                id: response.id,
                isAdmin: response.isAdmin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Log in successfully!",
            user: response,
            jwt: token,
        });

    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller ' + error,
        });
    }
};

module.exports = {
    loginSuccess
}