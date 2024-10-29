const Cart = require("../models/Cart");
const Product = require("../models/Product");

const cartController = {
  addToCart: async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
      let cart = await Cart.findOne({ userId });
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!cart) {
        const newCart = new Cart({
          userId,
          items: [{ productId, quantity }],
        });
        
        await newCart.save();

        const result = await Cart.findOne({ userId }).populate(
          "items.productId"
        );

        if (!result) {
          return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(201).json({
          success: true,
          message: "Add to cart successfully !",
          data: result,
        });
      } else {
        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
          let item = cart.items[itemIndex];
          item.quantity = Math.min(item.quantity + quantity, product.quantity);
          cart.items[itemIndex] = item;
        } else {
          cart.items.push({ productId, quantity });
        }
        cart = await cart.save();

        const result = await Cart.findOne({ userId }).populate(
          "items.productId"
        );
        if (!result) {
          return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(201).json({
          success: true,
          message: "Add to cart successfully !",
          data: result,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCart: async (req, res) => {
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      res.status(200).json({
        success: true,
        message: "Get cart successfully !",
        data: cart,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCart: async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        let item = cart.items[itemIndex];
        item.quantity = quantity;
        cart.items[itemIndex] = item;
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      cart = await cart.save();

      const result = await Cart.findOne({ userId }).populate("items.productId");
      if (!result) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Update cart successfully !",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeFromCart: async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      cart = await cart.save();
      const result = await Cart.findOne({ userId }).populate("items.productId");
      if (!result) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Remove product in cart successfully !",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteCart: async (req, res) => {
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      await Cart.findByIdAndDelete(cart._id);
      res.status(200).json({ message: "Cart has been deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = cartController;
