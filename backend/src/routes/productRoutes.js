const express = require("express");
const router = express.Router();

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} = require("../controllers/productController");

const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  uploadMemory,
  handleCloudinaryUpload,
} = require("../middlewares/uploadMiddleware");

/* =====================================================
   PUBLIC ROUTES
===================================================== */

// GET ALL PRODUCTS
router.get("/", getAllProducts);

// GET SINGLE PRODUCT
router.get("/single/:id", getProduct);

/* =====================================================
   ADMIN ROUTES - WITH CLOUDINARY
===================================================== */

// CREATE PRODUCT (Cloudinary + local fallback)
router.post(
  "/create",
  adminMiddleware,
  uploadMemory.array("images", 5),
  handleCloudinaryUpload,
  createProduct
);

// UPDATE PRODUCT (Cloudinary + local fallback)
router.put(
  "/update/:id",
  adminMiddleware,
  uploadMemory.array("images", 5),
  handleCloudinaryUpload,
  updateProduct
);

// DELETE PRODUCT
router.delete("/delete/:id", adminMiddleware, deleteProduct);

module.exports = router;
