const { configDotenv } = require("dotenv");
const User = require("../models/User");
// const UserGoogle = require("../models/UserGoogle");

const axios = require("axios");
const https = require('https');
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Set this to false to ignore certificate errors
    }),
});

const paymentController = {

    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_ACCESS_PAYMENT,
            { expiresIn: "1d" }
        );
    },

    sendTransactionByUserId: async (req, res) => {
        try {
            const userId = req.user.id;
            const response = await axiosInstance.post('https://localhost:5000/api/payment/get-transaction', { userId });
            if (response.data.success) {
                return res.status(200).json({
                    success: true,
                    message: response.data.message,
                    data: response.data.data,
                });
            } else {
                // Return failure response based on the payment system's response
                return res.status(400).json({
                    success: false,
                    message: response.data.message,
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: "Internal server error"
            });
        }
    },

    sendDataToPaymentSystem: async (req, res) => {
        try {
            // Validate request body
            const amount  = req.body.amount;
    
            const userId = req.user.id;

            if (!amount || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "Amount and userId are required in the request body.",
                });
            }
    
            // Make Axios request to payment system
            const response = await axiosInstance.post('https://localhost:5000/api/payment/execute-payment', { amount, userId });
    
            if (response.data.success) {
                // Return success response
                return res.status(200).json({
                    success: true,
                    message: response.data.message,
                });
            } else {
                // Return failure response based on the payment system's response
                return res.status(400).json({
                    success: false,
                    message: response.data.message,
                });
            }
        } catch (error) {
            console.error('Payment processing error', error);
    
            // Return a generic error response
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message, // Include more details if available
            });
        }
    },

    sendDataToRequestCreateAccount: async (req, res) => {
        try {
            const userId = req.user.id;
            //console.log(token);
            console.log(userId);
            const response = await axiosInstance.post('https://localhost:5000/api/payment/create-account', { userId });
            res.status(200).json({ message: "send successfully", data: response.data });
            return response.data;
        } catch (error) {
            console.error('Payment processing error', error);
            throw error;
        }
    },

    sendRequestEmail: async (req, res) => {
        try {
            const id = req.user.id;
            const user = await User.findById(id);
            const userGoogle = await UserGoogle.findById(id);


            const email = user?.email;
            const emailGoogle = userGoogle?.email;

            let email1 = email ? email : emailGoogle;

            if (email1) {
                const response = await axiosInstance.post('https://localhost:5000/api/payment/verify-email', { email1 , id });
                if (response.data.success) {
                    res.status(200).json({
                        success: true,
                        message: response.data.message,
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: response.data.message,
                    });
                }
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
    receiveCodeEmail: async (req, res) => {
        try {
            const code = req.body.code;
            console.log(code);
            const id = req.user.id;
            console.log(id);
            if (code) {
                const response = await axiosInstance.post('https://localhost:5000/api/payment/verify-code', {code, id });
                if (response.data.success) {
                    res.status(200).json({
                        success: true,
                        message: response.data.message,
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: response.data.message,
                    });
                }
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    deposit: async (req, res) => {
        try {
            const amount = req.body.amount;
            console.log(amount);
            const id = req.user.id;
            console.log(id);
            if (amount) {
                const response = await axiosInstance.post('https://localhost:5000/api/payment/deposit', {amount, id });
                if (response.data.success) {
                    res.status(200).json({
                        success: true,
                        message: response.data.message,
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: response.data.message,
                    });
                }
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    getAmount: async (req, res) => {
        try {
            const id = req.user.id;
            if (id) {
                const response = await axiosInstance.post('https://localhost:5000/api/payment/getAmount', { id });
                if (response.data.success) {
                    res.status(200).json({
                        success: true,
                        message: response.data.message,
                        data: response.data.data
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: response.data.message,
                        data: {}
                    });
                }
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    getAllTransaction: async (req, res) => {
        try {
            //const id = req.user.id;
            const { page, limit} = req.query;
            const response = await axiosInstance.post('https://localhost:5000/api/payment/getAllTransaction', { page , limit });
            if (response.data.success) {
                res.status(200).json({
                    success: true,
                    message: response.data.message,
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: response.data.message,
                    data: {}
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
};

module.exports = paymentController;
