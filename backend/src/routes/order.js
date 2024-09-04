const orderController = require("../controllers/OrderController");
const middlewareController = require("../middlewares/accessToken");
const PaymentController = require("../controllers/PaypalController");

const router = require("express").Router();

router.post("/create", middlewareController.verifyToken, (req, res) => {
    orderController.createOrder(req, res).catch((error) => {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// GET ALL ORDER
router.get("/", middlewareController.verifyToken, (req, res) => {
    orderController.getAllOrder(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// GET ORDER BY ID
router.get("/:id", middlewareController.verifyToken, (req, res) => {
    orderController.getOrderById(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// UPDATE ORDER BY ID
router.post("/update/:id", middlewareController.verifyTokenAndAdminAuth, (req, res) => {
    orderController.updateOrder(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// DELETE ORDER BY ID
router.get("/delete/:id", middlewareController.verifyTokenAndAdminAuth, (req, res) => {
    orderController.deleteOrder(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// GET ORDERS BY USER ID
router.get("/user/:id", middlewareController.verifyToken, (req, res) => {
    orderController.getOrdersByUserId(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

router.post("/paypal", middlewareController.verifyToken, async (req, res) => {
    try {
        // use the cart information passed from the front-end to calculate the order amount detals
        const { items, totalPrice } = req.body;
        const data = { cart: items, totalPrice: totalPrice };
        const { jsonResponse, httpStatusCode } = await PaymentController.createOrder(data);

        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

router.post("/paypal/:orderID/capture", middlewareController.verifyToken, async (req, res) => {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = await PaymentController.captureOrder(orderID);

        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
});


module.exports = router;
