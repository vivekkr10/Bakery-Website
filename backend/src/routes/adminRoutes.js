// src/routes/adminRoutes.js
const express = require("express");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const CustomCakeOrder = require("../models/CustomCakeOrder");
const { uploadDisk } = require("../middlewares/uploadMiddleware");

const adminAuth = require("../middlewares/adminMiddleware");
const superAdminAuth = require("../middlewares/superAdminAuth");

const router = express.Router();

/* ============================================================
   FIRST SUPER ADMIN REGISTER (ONE-TIME ONLY)
============================================================ */
router.post("/register-super-admin", async (req, res) => {
  console.log("🔥 Route hit: /register-super-admin");

  try {
    console.log("📥 Request Body:", req.body);
    const { name, email, password } = req.body;
    console.log("🔍 Checking for existing super admin...");
    const checkSuper = await Admin.findOne({ role: "super-admin" });
    console.log("🟡 checkSuper result:", checkSuper);
    if (checkSuper) {
      console.log("❌ Super Admin already exists!");
      return res.status(403).json({
        message: "Super Admin already exists",
      });
    }
    console.log("🛠 Creating new super admin...");
    const admin = await Admin.create({
      name,
      email,
      password,
      role: "super-admin",
    });
    console.log("✅ Super Admin created:", admin);
    res.status(201).json({
      success: true,
      message: "Super Admin registered successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.log("🔥 ERROR inside route:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN LOGIN (For Admin + Super Admin)
============================================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = admin.generateToken();

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: { id: admin._id, email: admin.email, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   SUPER ADMIN → Create Admin
============================================================ */
router.post("/create", superAdminAuth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || "admin",
    });

    res.status(201).json({
      success: true,
      message: "New admin created successfully",
      admin: { id: admin._id, email: admin.email, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   SUPER ADMIN → Get All Admins
============================================================ */
router.get("/admins", superAdminAuth, async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   SUPER ADMIN → Delete Admin
============================================================ */
router.delete("/:id", superAdminAuth, async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   SUPER ADMIN → Block / Unblock Admin
============================================================ */
router.patch("/admins/block/:id", superAdminAuth, async (req, res) => {
  try {
    const { blocked } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.isBlocked = blocked;
    await admin.save();

    res.json({
      success: true,
      message: blocked ? "Admin blocked" : "Admin unblocked",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Get All Products
============================================================ */
router.get("/products", adminAuth, async (req, res) => {
  try {
    console.log("📦 Fetching all products...");
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${products.length} products`);
    res.json({ success: true, products });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Add Product
============================================================ */
router.post(
  "/product",
  adminAuth,
  uploadDisk.array("images", 10),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        category,
        stock,
        isFeatured,
        tags,
        flavour,
        weight,
      } = req.body;

      if (!name || !price)
        return res.status(400).json({ message: "Name and price required" });

      const imagePaths = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );

      const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        isFeatured,
        flavour: flavour || "Vanilla",
        weight: weight || "500g",
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        images: imagePaths,
      });

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ============================================================
   ADMIN + SUPER ADMIN → Get Single Product
============================================================ */
router.get("/product/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Update Product
============================================================ */
router.put("/product/:id", adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      isFeatured,
      tags,
      flavour,
      weight,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update product fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (flavour !== undefined) product.flavour = flavour;
    if (weight !== undefined) product.weight = weight;
    if (tags !== undefined) {
      product.tags =
        typeof tags === "string"
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t)
          : tags;
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Delete Product
============================================================ */
router.delete("/product/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Get All Users
============================================================ */
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Delete User
============================================================ */
router.delete("/user/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Block / Unblock User
============================================================ */
router.patch("/user/block/:id", adminAuth, async (req, res) => {
  try {
    const { blocked } = req.body; // expected true or false

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = blocked; // update model field
    await user.save();

    res.json({
      success: true,
      message: blocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Get All Orders (Both Regular & Custom)
============================================================ */
router.get("/orders", adminAuth, async (req, res) => {
  try {
    // Get regular orders
    const regularOrders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phone")
      .lean();

    // Get custom cake orders
    const customCakeOrders = await CustomCakeOrder.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phone")
      .lean();

    // Convert custom cake orders to match regular order format
    const formattedCustomOrders = customCakeOrders.map((order) => ({
      _id: order._id,
      user: order.user,
      orderNumber: order.orderNumber,
      items: [
        {
          name: "Custom Cake",
          price: order.totalPrice,
          qty: order.quantity || 1,
          img:
            order.customerDesignImage?.url || "/images/custom-cake-default.jpg",
        },
      ],
      totalAmount: order.totalPrice,
      subtotal: order.basePrice,
      tax: 0,
      deliveryCharge: 0,
      orderStatus: order.status || "pending",
      paymentStatus: order.paymentStatus || "pending",
      paymentMethod: order.paymentId ? "razorpay" : "cod",
      shippingAddress: order.deliveryAddress || {},
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      isCustomCake: true,
      customDetails: order.customizations,
    }));

    // Combine both types of orders
    const allOrders = [...regularOrders, ...formattedCustomOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      orders: allOrders,
      counts: {
        total: allOrders.length,
        regular: regularOrders.length,
        custom: customCakeOrders.length,
      },
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Get Single Order Details
============================================================ */
router.get("/orders/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // First check regular orders
    let order = await Order.findById(id)
      .populate("user", "name email phone address")
      .lean();

    // If not found, check custom cake orders
    if (!order) {
      order = await CustomCakeOrder.findById(id)
        .populate("user", "name email phone")
        .lean();

      if (order) {
        order.isCustomCake = true;
        order.items = [
          {
            name: "Custom Cake",
            price: order.totalPrice,
            qty: order.quantity || 1,
            img:
              order.customerDesignImage?.url ||
              "/images/custom-cake-default.jpg",
          },
        ];
      }
    }

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Update Order Status
============================================================ */
router.put("/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    let order;

    // First try to update regular order
    order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        updatedAt: Date.now(),
        ...(status === "delivered" && { deliveredAt: Date.now() }),
      },
      { new: true }
    );

    // If not found, try to update custom cake order
    if (!order) {
      order = await CustomCakeOrder.findByIdAndUpdate(
        id,
        {
          status: status,
          updatedAt: Date.now(),
          ...(status === "delivered" && { deliveredAt: Date.now() }),
        },
        { new: true }
      );
    }

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Delete Order
============================================================ */
router.delete("/orders/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    let order;

    // First try to delete regular order
    order = await Order.findByIdAndDelete(id);

    // If not found, try to delete custom cake order
    if (!order) {
      order = await CustomCakeOrder.findByIdAndDelete(id);
    }

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Update Payment Status
============================================================ */
router.put("/orders/:id/payment-status", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Payment status is required" });
    }

    const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(
          ", "
        )}`,
      });
    }

    let order;

    // Try to update regular order
    order = await Order.findByIdAndUpdate(
      id,
      {
        paymentStatus: paymentStatus,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    // If not found, try to update custom cake order
    if (!order) {
      order = await CustomCakeOrder.findByIdAndUpdate(
        id,
        {
          paymentStatus: paymentStatus,
          updatedAt: Date.now(),
        },
        { new: true }
      );
    }

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      order,
    });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   ADMIN DASHBOARD (Enhanced Analytics with Orders)
============================================================ */
router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();

    // Get order statistics
    const totalOrders = await Order.countDocuments();
    const totalCustomOrders = await CustomCakeOrder.countDocuments();

    // Calculate revenue (only from delivered orders)
    const deliveredOrders = await Order.find({ orderStatus: "delivered" });
    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's orders
    const todaysOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Today's custom orders
    const todaysCustomOrders = await CustomCakeOrder.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    res.json({
      success: true,
      stats: {
        totalUsers: users,
        totalProducts: products,
        totalOrders: totalOrders + totalCustomOrders,
        totalRegularOrders: totalOrders,
        totalCustomOrders: totalCustomOrders,
        todaysOrders: todaysOrders + todaysCustomOrders,
        totalRevenue: totalRevenue,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
      charts: {
        orderStatus: {
          pending: await Order.countDocuments({ orderStatus: "pending" }),
          confirmed: await Order.countDocuments({ orderStatus: "confirmed" }),
          preparing: await Order.countDocuments({ orderStatus: "preparing" }),
          "out-for-delivery": await Order.countDocuments({
            orderStatus: "out-for-delivery",
          }),
          delivered: await Order.countDocuments({ orderStatus: "delivered" }),
          cancelled: await Order.countDocuments({ orderStatus: "cancelled" }),
        },
        paymentStatus: {
          pending: await Order.countDocuments({ paymentStatus: "pending" }),
          paid: await Order.countDocuments({ paymentStatus: "paid" }),
          failed: await Order.countDocuments({ paymentStatus: "failed" }),
          refunded: await Order.countDocuments({ paymentStatus: "refunded" }),
        },
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   ADMIN + SUPER ADMIN → Get Recent Orders (for dashboard)
============================================================ */
router.get("/recent-orders", adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent regular orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name email")
      .lean();

    // Get recent custom cake orders
    const recentCustomOrders = await CustomCakeOrder.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name email")
      .lean();

    // Format custom orders
    const formattedCustomOrders = recentCustomOrders.map((order) => ({
      _id: order._id,
      user: order.user,
      orderNumber: order.orderNumber,
      totalAmount: order.totalPrice,
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      isCustomCake: true,
      items: [
        {
          name: "Custom Cake",
          price: order.totalPrice,
          qty: order.quantity || 1,
        },
      ],
    }));

    // Combine and sort
    const allRecentOrders = [...recentOrders, ...formattedCustomOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.json({
      success: true,
      orders: allRecentOrders,
    });
  } catch (err) {
    console.error("Error fetching recent orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
