const express = require("express");
const router = express.Router();

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} = require("../controllers/productController");


const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// PUBLIC ROUTES
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// ADMIN ROUTES
router.post("/create", adminMiddleware, createProduct);
router.put("/update/:id", adminMiddleware, updateProduct);
router.delete("/delete/:id", adminMiddleware, deleteProduct);

module.exports = router;
