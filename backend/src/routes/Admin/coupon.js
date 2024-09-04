const couponController = require("../../controllers/Admin/couponController");

const middlewareController = require("../../middlewares/accessToken")
const router = require("express").Router();

// GET COUPON BY ID
router.get("/:id",middlewareController.verifyTokenAndAdminAuth, couponController.getCouponByID);

// GET ALL COUPONS
router.get("/",middlewareController.verifyTokenAndAdminAuth, couponController.getAllCoupons);

// ADD COUPON
router.post("/add",middlewareController.verifyTokenAndAdminAuth, couponController.addCoupon);

// UPDATE COUPON
router.post("/update/:id",middlewareController.verifyTokenAndAdminAuth, couponController.updateCoupon);

// DELETE COUPON
router.get("/delete/:id",middlewareController.verifyTokenAndAdminAuth, couponController.deleteCoupon);

// CHECK COUPON
router.post("/check",middlewareController.verifyToken, couponController.checkCoupon);

module.exports = router;