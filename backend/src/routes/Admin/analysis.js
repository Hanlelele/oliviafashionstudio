const express = require('express');
const router = express.Router();
const analysisController = require('../../controllers/Admin/analysisController');
const middlewareController = require('../../middlewares/accessToken');


router.get('/total-order', middlewareController.verifyTokenAndAdminAuth, analysisController.getOrderCount);

router.get('/total-revenue', middlewareController.verifyTokenAndAdminAuth, analysisController.getTotalRevenue);

router.get('/total-product', middlewareController.verifyTokenAndAdminAuth, analysisController.getProductCount);


module.exports = router;