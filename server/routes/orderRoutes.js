const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { protect, staff } = require("../middleware/auth");

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, staff, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, staff, updateOrderStatus);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
