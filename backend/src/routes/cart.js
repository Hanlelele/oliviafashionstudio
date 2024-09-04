const cartController = require('../controllers/CartController');
const middlewareController = require("../middlewares/accessToken");
const router = require("express").Router();


router.post('/add', middlewareController.verifyToken, cartController.addToCart);
router.get('/', middlewareController.verifyToken, cartController.getCart);
router.post('/update', middlewareController.verifyToken, cartController.updateCart);
router.post('/remove', middlewareController.verifyToken, cartController.removeFromCart);
router.post('/delete', middlewareController.verifyToken, cartController.deleteCart);

module.exports = router;
