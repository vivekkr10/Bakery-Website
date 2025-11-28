const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const { protect } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Order = require('../models/Order');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/profile-pics';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});


// router.get('/me', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });


router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, email, username } = req.body; 

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;

    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: 'Old password incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/upload-profile-pic', protect, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    user.profilePic = req.file.path;
    await user.save();

    res.json({ success: true, message: 'Profile picture uploaded', profilePic: req.file.path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/wallet', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance');
    res.json({ success: true, balance: user.walletBalance || 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/purchases', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, purchases: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.patch('/add-money', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Invalid amount' });

    const user = await User.findById(req.user.id);
    user.walletBalance += Number(amount);
    await user.save();

    res.json({ success: true, message: 'Wallet updated', balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
















