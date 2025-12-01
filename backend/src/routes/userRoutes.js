const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// AUTH MIDDLEWARE (CORRECTED)
const protect = require("../middlewares/authMiddleware");

const User = require("../models/User");
const Order = require("../models/Order");

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/profile-pics";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// ----------------------------------------------------
// UPDATE PROFILE
// ----------------------------------------------------
router.put("/update-profile/:id", protect, async (req, res) => {
  try {
    const { name, email, username } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// UPLOAD PROFILE PIC
// ----------------------------------------------------
router.put(
  "/upload-profile-pic",
  protect,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const user = await User.findById(req.user.id);
      user.profilePic = req.file.path;
      await user.save();

      res.json({
        success: true,
        message: "Profile picture uploaded",
        profilePic: req.file.path,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ----------------------------------------------------
// WALLET BALANCE
// ----------------------------------------------------
router.get("/wallet", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("walletBalance");
    res.json({
      success: true,
      balance: user.walletBalance || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// PURCHASE HISTORY
// ----------------------------------------------------
router.get("/purchases", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, purchases: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// ADD MONEY TO WALLET
// ----------------------------------------------------
router.patch("/add-money", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(req.user.id);
    user.walletBalance += Number(amount);
    await user.save();

    res.json({
      success: true,
      message: "Wallet updated",
      balance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// DELETE USER ACCOUNT

router.delete("/delete-account", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ADD ADDRESS

router.post("/add-address", protect, async (req, res) => {
  try {
    const { addressLine, city, state, pincode, country } = req.body;

    if (!addressLine || !city || !state || !pincode)
      return res.status(400).json({ message: "All address fields required" });

    const user = await User.findById(req.user.id);

    const newAddress = {
      addressLine,
      city,
      state,
      pincode,
      country: country || "India"
    };

    user.addresses = user.addresses || [];
    user.addresses.push(newAddress);

    await user.save();

    res.json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// UPDATE ADDRESS

router.put("/update-address/:addressId", protect, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { addressLine, city, state, pincode, country } = req.body;

    const user = await User.findById(req.user.id);

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    address.addressLine = addressLine || address.addressLine;
    address.city = city || address.city;
    address.state = state || address.state;
    address.pincode = pincode || address.pincode;
    address.country = country || address.country;

    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      address
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ADD PHONE NUMBER

router.patch("/add-phone", protect, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const user = await User.findById(req.user.id);
    user.phone = phone;
    await user.save();

    res.json({
      success: true,
      message: "Phone number updated successfully",
      phone: user.phone
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// REMOVE PROFILE PICTURE

router.delete("/remove-profile-pic", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.profilePic) {
      return res.status(400).json({ message: "No profile picture to remove" });
    }

    // Delete from folder
    if (fs.existsSync(user.profilePic)) {
      fs.unlinkSync(user.profilePic);
    }

    // Remove from database
    user.profilePic = null;
    await user.save();

    res.json({
      success: true,
      message: "Profile picture removed successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;