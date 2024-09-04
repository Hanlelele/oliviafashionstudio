const Coupon = require('../../models/Coupon');

const couponController = {
    getAllCoupons: async (req, res) => {
        try {
            const coupons = await Coupon.find();
            
            res.status(200).json({
                success: true,
                message: 'Get all coupon successfully !',
                data: coupons
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err,
                data: []
            });
        }
    },

    addCoupon: async (req, res) => {
        try {
            const newCoupon = await new Coupon({
                name: req.body.name,
                discountPercentage: req.body.discountPercentage,
            })
            const coupon = await newCoupon.save();
            res.status(200).json({
                success: true,
                message: 'Add Coupon successfully !',
                data: coupon
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err,
                data: []
            });
        }
    },

    getCouponByID: async (req, res) => {
        try {
            const id = req.params.id;

            const coupon = await Coupon.findById(id);
            res.status(200).json({
                success: true,
                message: 'Get Coupon by Id successfully !',
                data: coupon
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err,
                data: []
            });
        }
    },

    updateCoupon: async (req, res) => {
        try {
            const updateCoupon = {
                name: req.body.name,
                discountPercentage: req.body.discountPercentage
            }

            const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, updateCoupon, { new: true });
            res.status(200).json({
                success: true,
                message: 'update Coupon successfully !',
                data: updatedCoupon
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err,
                data: []
            });
        }
    },

    deleteCoupon: async (req, res) => {
        try {
            await Coupon.deleteOne({ _id: req.params.id })
            res.status(200).json({
                success: true,
                message: 'delete Coupon successfully !',
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err,
                data: []
            });
        }
    },

    checkCoupon: async (req, res) => {
        try {
            const coupon = await Coupon.findOne({ name: req.body.name })
            if(coupon) {
                res.status(200).json({
                    success: true,
                    message: 'Coupon applied successfully!',
                    data: coupon
                });
            }

            else {
                res.status(200).json({
                    success: false,
                    message: 'The coupon is incorrect, please check your code and try again!!',
                    data: {}
                });
            }

        } catch (err) {
            res.status(500).json({
                success: false,
                message: err,
                data: []
            });
        }
    },
}

module.exports = couponController;