const User = require("../../models/User");
const bcrypt = require("bcrypt");

const userController = {

    //GET ALL USER
    getAllUser: async (req, res) => {
        try {
            // const { page, limit } = req.query;
            // const offset = (page - 1) * limit;

            // const products = await Product.find().skip(offset).limit(limit).exec();
            // const totalProducts = await Product.countDocuments().exec()

            const users = await User.find();

            res.status(200).json({
                success: true,
                message: 'Get all user successfully !',
                //totalPages: Math.ceil(totalProducts / limit),
                data: users
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err,
                data: []
            });
        }
    },

    // GET USER BY ID
    getUserByID: async (req, res) => {
        try {

            const user = await User.find({ _id: req.params.id });

            res.status(200).json({
                success: true,
                message: 'Get user successfully !',
                data: user
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err,
                data: []
            });
        }
    },

    //UPDATE USER
    updateUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const updateUser = {
                fullname: req.body.fullname,
                username: req.body.username,
                password: hashed,
                email: req.body.email,
            };

            // Update the employee using findByIdAndUpdate
            const updatedUser = await User.findByIdAndUpdate(req.params.id, updateUser, { new: true });

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found',
                    data: {}
                });
            }

            res.status(200).json({
                success: true,
                message: 'Update user successfully!',
                data: updatedUser
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: {}
            });
        }
    },

    //UPDATE USER
    deleteUser: async (req, res) => {
        try {
            await User.deleteOne({_id: req.params.id})
            res.status(200).json({
                success: true,
                message: 'delete user successfully!',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: {}
            });
        }
    }
};

module.exports = userController;