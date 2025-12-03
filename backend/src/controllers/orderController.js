const Order = require("../models/Order");
const Product = require("../models/Product");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

/* =====================================================
   CREATE ORDER (USER)
===================================================== */
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) return res.status(404).json({ message: "Product not found" });

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      totalAmount += product.price * item.qty;
    }

    let razorpayOrder = null;

    if (paymentMethod === "razorpay") {
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      razorpay: razorpayOrder ? { orderId: razorpayOrder.id } : {},
    });

    res.status(201).json({ success: true, order, razorpayOrder });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   VERIFY PAYMENT
===================================================== */
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const order = await Order.findOneAndUpdate(
      { "razorpay.orderId": orderId },
      {
        paymentStatus: "paid",
        "razorpay.paymentId": paymentId,
        "razorpay.signature": signature,
        orderStatus: "confirmed",
      },
      { new: true }
    );

    // reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   USER ORDERS
===================================================== */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   ADMIN → ALL ORDERS
===================================================== */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   UPDATE ORDER STATUS (ADMIN)
===================================================== */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;

    if (status === "delivered") order.deliveredAt = Date.now();
    if (status === "cancelled") order.cancelledAt = Date.now();

    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   CANCEL ORDER (USER)
===================================================== */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus === "delivered") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = Date.now();

    await order.save();

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
