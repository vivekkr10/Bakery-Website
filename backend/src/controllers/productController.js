const Product = require("../models/Product");
const { deleteFromCloudinary } = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

// Helper: Extract Cloudinary public_id from URL
const extractPublicId = (url) => {
  if (!url) return null;

  // Cloudinary URL pattern
  const cloudinaryMatch = url.match(
    /upload\/(?:v\d+\/)?(.+?)\.(?:jpg|jpeg|png|webp)/
  );
  if (cloudinaryMatch && cloudinaryMatch[1]) {
    return cloudinaryMatch[1];
  }

  return null;
};

// ============= GET ALL PRODUCTS =============
exports.getAllProducts = async (req, res) => {
  try {
    console.log("📦 Fetching all products...");

    const {
      category,
      flavour,
      minPrice,
      maxPrice,
      limit = 100,
      page = 1,
      search,
    } = req.query;

    let filter = {};

    // Build filter
    if (category && category !== "All") {
      filter.category = category;
    }

    if (flavour && flavour !== "All") {
      filter.flavour = flavour;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { flavour: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .select("-cloudinaryPublicIds"); // Don't send public_ids to frontend

    const total = await Product.countDocuments(filter);

    console.log(`✅ Found ${products.length} products`);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products: products.map((product) => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        category: product.category || "Classic Cakes",
        description: product.description || "Delicious bakery item",
        stock: product.stock || 0,
        flavour: product.flavour || "Vanilla",
        weight: product.weight || "500g",
        images: product.images || [],
        rating: product.rating || 0,
        reviewsCount: product.reviewsCount || 0,
        isFeatured: product.isFeatured || false,
        tags: product.tags || [],
        createdAt: product.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ============= GET SINGLE PRODUCT =============
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select(
      "-cloudinaryPublicIds"
    ); // Don't send public_ids to frontend

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ============= CREATE PRODUCT =============
exports.createProduct = async (req, res) => {
  try {
    console.log("🛠️ Creating new product...");
    console.log("📦 Request body:", req.body);

    const {
      name,
      price,
      category,
      flavour,
      weight,
      description,
      stock,
      tags,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    // Determine image sources
    let images = [];
    let cloudinaryPublicIds = [];

    // Priority 1: Cloudinary uploads
    if (req.cloudinaryFiles && req.cloudinaryFiles.length > 0) {
      images = req.cloudinaryFiles;
      cloudinaryPublicIds = req.cloudinaryPublicIds || [];
      console.log("✅ Using Cloudinary images");
    }
    // Priority 2: Local uploads (fallback)
    else if (req.localFiles && req.localFiles.length > 0) {
      images = req.localFiles;
      console.log("⚠️ Using local storage images (fallback)");
    }
    // Priority 3: Files from multer disk storage
    else if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/products/${file.filename}`);
      console.log("📁 Using local disk storage images");
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create product
    const product = new Product({
      name,
      slug,
      price: Number(price),
      category,
      flavour: flavour || "Vanilla",
      weight: weight || "500g",
      description: description || "",
      stock: stock ? Number(stock) : 0,
      images,
      cloudinaryPublicIds,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      isFeatured: isFeatured === "true",
      rating: 0,
      reviewsCount: 0,
    });

    await product.save();

    console.log("✅ Product created:", product._id);

    // Don't send cloudinaryPublicIds to frontend
    const responseProduct = product.toObject();
    delete responseProduct.cloudinaryPublicIds;

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: responseProduct,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// ============= UPDATE PRODUCT =============
// ============= UPDATE PRODUCT =============
exports.updateProduct = async (req, res) => {
  try {
    console.log("🔄 Updating product:", req.params.id);
    console.log("📦 Request body:", req.body);
    console.log("📦 Tags received:", req.body.tags);
    console.log("📦 Tags type:", typeof req.body.tags);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update basic fields
    const updates = { ...req.body };

    // Handle number conversions
    if (updates.price) updates.price = Number(updates.price);
    if (updates.stock) updates.stock = Number(updates.stock);
    if (updates.rating) updates.rating = Number(updates.rating);

    // FIX: Handle tags properly
    if (updates.tags) {
      if (typeof updates.tags === "string") {
        // If tags is a string (comma-separated), split it
        updates.tags = updates.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      } else if (Array.isArray(updates.tags)) {
        // If tags is already an array, use it directly
        updates.tags = updates.tags
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      } else {
        // If it's something else, set to empty array
        updates.tags = [];
      }
    }

    console.log("📦 Tags after processing:", updates.tags);

    // Handle boolean
    if (updates.isFeatured) {
      updates.isFeatured = updates.isFeatured === "true";
    }

    // Handle new images
    let newImages = [];
    let newPublicIds = [];

    // Add Cloudinary images
    if (req.cloudinaryFiles && req.cloudinaryFiles.length > 0) {
      newImages = [...newImages, ...req.cloudinaryFiles];
      newPublicIds = [...newPublicIds, ...(req.cloudinaryPublicIds || [])];
    }

    // Add local images
    if (req.localFiles && req.localFiles.length > 0) {
      newImages = [...newImages, ...req.localFiles];
    } else if (req.files && req.files.length > 0) {
      const localImages = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
      newImages = [...newImages, ...localImages];
    }

    // If new images were uploaded, replace or append based on request
    if (newImages.length > 0) {
      if (req.body.replaceImages === "true") {
        // Delete old Cloudinary images
        if (
          product.cloudinaryPublicIds &&
          product.cloudinaryPublicIds.length > 0
        ) {
          for (const publicId of product.cloudinaryPublicIds) {
            try {
              await deleteFromCloudinary(publicId);
              console.log(`🗑️ Deleted Cloudinary image: ${publicId}`);
            } catch (err) {
              console.error(
                `❌ Error deleting Cloudinary image: ${err.message}`
              );
            }
          }
        }

        // Replace all images
        updates.images = newImages;
        updates.cloudinaryPublicIds = newPublicIds;
      } else {
        // Append new images
        updates.images = [...product.images, ...newImages];
        updates.cloudinaryPublicIds = [
          ...(product.cloudinaryPublicIds || []),
          ...newPublicIds,
        ];
      }
    }

    // Update slug if name changed
    if (updates.name && updates.name !== product.name) {
      updates.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Apply updates
    Object.assign(product, updates);
    await product.save();

    // Prepare response
    const responseProduct = product.toObject();
    delete responseProduct.cloudinaryPublicIds;

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: responseProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// ============= DELETE PRODUCT =============
exports.deleteProduct = async (req, res) => {
  try {
    console.log("🗑️ Deleting product:", req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete Cloudinary images
    if (product.cloudinaryPublicIds && product.cloudinaryPublicIds.length > 0) {
      console.log(
        `🗑️ Deleting ${product.cloudinaryPublicIds.length} images from Cloudinary...`
      );

      for (const publicId of product.cloudinaryPublicIds) {
        try {
          await deleteFromCloudinary(publicId);
          console.log(`✅ Deleted Cloudinary image: ${publicId}`);
        } catch (cloudinaryError) {
          console.error(
            `❌ Error deleting Cloudinary image: ${cloudinaryError.message}`
          );
        }
      }
    }

    // Delete local files
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.startsWith("/uploads/")) {
          const filePath = path.join(__dirname, "..", "..", image);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`🗑️ Deleted local file: ${filePath}`);
            } catch (fileError) {
              console.error(
                `❌ Error deleting local file: ${fileError.message}`
              );
            }
          }
        }
      }
    }

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
