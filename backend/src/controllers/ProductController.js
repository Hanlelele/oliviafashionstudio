const Product = require("../models/Product");
const Order = require("../models/Order");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const { page, limit, order, minPrice, maxPrice } = req.query;
      const offset = (page - 1) * limit;

      const keyWordSearch = req.query.search;

      const query = {}; // Define the query variable

      if (keyWordSearch) {
        query.$or = [
          { name: { $regex: new RegExp(keyWordSearch, "i") } },
          { id: { $regex: new RegExp(keyWordSearch, "i") } },
        ];
      }

      if (minPrice && maxPrice) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      }

      const sortDirection = order === "desc" ? -1 : 1;
      const sortField = "price"; // You can change this to any field you want to sort by

      const products = await Product.find(query)
        .skip(offset)
        .limit(limit)
        .sort({ [sortField]: sortDirection })
        .exec();

      const totalProducts = await Product.countDocuments(query).exec();

      res.status(200).json({
        success: true,
        message: "Get all products successfully!",
        totalPages: Math.ceil(totalProducts / limit),
        data: products,
        totalProducts: totalProducts,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: [],
      });
    }
  },

  getSimilarProducts: async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findById(id);
      const productCategory = product.id_category;
      const similarProducts = await Product.find({
        id_category: { $in: productCategory },
        _id: { $ne: id },
      }).limit(4);

      res.status(200).json({
        success: true,
        message: "Get similar products successfully!",
        data: similarProducts,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: [],
      });
    }
  },

  getProductById: async (req, res) => {
    try {
      const id = req.params.id;

      const product = await Product.findById(id);

      res.status(200).json({
        success: true,
        message: "Get product successfully !",
        data: product,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: {},
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const updateProduct = {
        name: req.body.name,
        id_category: req.body.id_category,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        quantity: req.body.quantity,
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateProduct,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
          data: {},
        });
      }
      return res.status(200).json({
        success: true,
        message: "Edit Product successfully !",
        data: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: err,
        data: {},
      });
    }
  },

  getAllProductInCate: async (req, res) => {
    try {
      const categoryId = req.params.categoryId;

      const { page, limit, order, minPrice, maxPrice } = req.query;
      const offset = (page - 1) * limit;

      const keyWordSearch = req.query.search;

      const query = {
        id_category: categoryId,
      };

      if (keyWordSearch) {
        query.$or = [
          { name: { $regex: new RegExp(keyWordSearch, "i") } },
          { id: { $regex: new RegExp(keyWordSearch, "i") } },
        ];
      }

      if (minPrice && maxPrice) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      }

      const sortDirection = order === "desc" ? -1 : 1;
      const sortField = "price";

      const products = await Product.find(query)
        .skip(offset)
        .limit(limit)
        .sort({ [sortField]: sortDirection })
        .exec();
      const totalProducts = await Product.countDocuments(query).exec();

      res.status(200).json({
        success: true,
        message: "Get all products in category successfully!",
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts: totalProducts,
        data: products,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: [],
      });
    }
  },

  getSaleProducts: async (req, res) => {
    try {
      // Lấy 15 sản phẩm có discountPercentage lớn nhất
      const products = await Product.find()
        .sort({ discountPercentage: -1 }) // Sắp xếp giảm dần theo discountPercentage
        .limit(15); // Giới hạn kết quả trả về 15 sản phẩm
  
      res.status(200).json({
        success: true,
        message: "Get sale products successfully!",
        data: products,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        data: [],
      });
    }
  },

  getTopProducts: async (req, res) => {
    try {
      // Sử dụng aggregation để tính tổng số lượng sản phẩm đã được đặt
      const topProducts = await Order.aggregate([
        { $unwind: "$items" }, // Tách mảng items thành các document riêng lẻ
        {
          $group: {
            _id: "$items.product", // Nhóm theo productId
            totalQuantity: { $sum: "$items.quantity" } // Tính tổng số lượng cho mỗi productId
          }
        },
        { $sort: { totalQuantity: -1 } }, // Sắp xếp theo tổng số lượng giảm dần
        { $limit: 15 } // Giới hạn kết quả trả về 15 sản phẩm
      ]);
  
      // Lấy chi tiết sản phẩm từ danh sách productId thu được từ aggregation
      const productIds = topProducts.map(product => product._id);
      const products = await Product.find({ _id: { $in: productIds } });
  
      res.status(200).json({
        success: true,
        message: "Get top 15 products ordered with highest quantity successfully!",
        data: products,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        data: [],
      });
    }
  },
};

module.exports = productController;