const Product = require("../models/Product");
const slugify = require("slugify");

/* =====================================================
   CREATE PRODUCT (ADMIN)
===================================================== */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, stock, tags, isFeatured } = req.body;

    const product = await Product.create({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      images,
      stock,
      tags,
      isFeatured,
      createdBy: req.admin?.id,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   UPDATE PRODUCT
===================================================== */
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const data = req.body;

    if (data.name) data.slug = slugify(data.name);

    product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   DELETE PRODUCT
===================================================== */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   GET ALL PRODUCTS (SEARCH + FILTER + PAGINATION)
===================================================== */
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort === "price_asc" ? { price: 1 } : sort === "price_desc" ? { price: -1 } : { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({ success: true, total, page, pages: Math.ceil(total / limit), products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   GET SINGLE PRODUCT
===================================================== */
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
