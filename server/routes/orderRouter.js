const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");

router.post("/orders", OrderController.create);
router.get("/orders/all", OrderController.getAll);
router.get("/orders/one", OrderController.getById);
router.post("/cancel", OrderController.cancelOrder);
router.post("/update/status", OrderController.updateOrderStatus);

module.exports = router;
