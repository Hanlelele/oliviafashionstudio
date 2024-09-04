const moment = require('moment');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

const analysisController = {

    getOrderCount: async (req, res) => {
        try {
            const orderCount = await Order.countDocuments();

            if (!orderCount) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                    data: {}
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Get Order Count successfully !',
                data: orderCount
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error,
                data: {}
            });
        }
    },

    getTotalRevenue: async (req, res) => {
        try {
            const totalRevenue = await Order.aggregate([
                { $match: { status: 'COMPLETED' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]);

            res.status(200).json({ 
                success: true,
                message: 'Get Total Revenue successfully !',
                data: totalRevenue[0].total });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: error.message
            });
        }
    },

    getProductCount: async (req, res) => {
        try {
            const productCount = await Product.countDocuments();

            if (!productCount) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                    data: {}
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Get Product Count successfully !',
                data: productCount
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error,
                data: {}
            });
        }
    },
};

module.exports = analysisController;