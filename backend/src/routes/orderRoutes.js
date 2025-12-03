const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// USER ROUTES 
router.post("/create", authMiddleware, createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/my", authMiddleware, getMyOrders);
router.put("/cancel/:id", authMiddleware, cancelOrder);

// ADMIN ROUTES
router.get("/admin/all", adminMiddleware, getAllOrders);
router.put("/admin/status/:id", adminMiddleware, updateOrderStatus);

module.exports = router;
