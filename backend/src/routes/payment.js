
const express = require('express');
const router = express.Router();
const middlewareController = require("../middlewares/accessToken");
const dotenv = require('dotenv');
dotenv.config();

router.get('/config', middlewareController.verifyToken, (req, res) => {
    return res.status(200).json({
        success: true,
        data: process.env.PAYPAL_CLIENT_ID
    })
});
module.exports = router;
