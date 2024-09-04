const categoryController = require("../../controllers/Admin/categoryController");

const middlewareController = require("../../middlewares/accessToken")
const router = require("express").Router();

// GET CATEGORY BY ID
router.get("/:id",middlewareController.verifyTokenAndAdminAuth, categoryController.getCategoryByID);

// GET ALL CATEGORIES
router.get("/",middlewareController.verifyTokenAndAdminAuth, categoryController.getAllCategories);

// ADD CATEGORY
router.post("/add",middlewareController.verifyTokenAndAdminAuth, categoryController.addCategory);

// UPDATE CATEGORY
router.post("/update/:id",middlewareController.verifyTokenAndAdminAuth, categoryController.updateCategory);

// DELETE CATEGORY
router.get("/delete/:id",middlewareController.verifyTokenAndAdminAuth, categoryController.deleteCategory);

module.exports = router;