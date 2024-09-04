const productController = require("../controllers/ProductController");
const router = require("express").Router();



// GET TOP PRODUCTS
router.get("/top", productController.getTopProducts);

// GET SALE PRODUCTS
router.get("/sale", productController.getSaleProducts);

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

// GET SIMILAR PRODUCTS
router.get("/similar/:id", productController.getSimilarProducts);

// GET PRODUCT BY ID
router.get("/:id", productController.getProductById);

// GET ALL PRODUCTS IN CATEGORY
router.get("/category/:categoryId", productController.getAllProductInCate);




module.exports = router;