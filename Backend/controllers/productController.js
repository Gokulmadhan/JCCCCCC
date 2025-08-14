const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// Allowed subcategories
const allowedSubcategories = ["tops", "bottoms", "innerwear", "vests", "activewear"];

// Create Product

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      originalPrice,
      sizes,
      description,
      fabric,
      care,
      colors,
      discount,
      category,
      subcategory,
      isFeatured
    } = req.body;

    if (!allowedSubcategories.includes(subcategory)) {
      return res.status(400).json({ error: "Invalid subcategory" });
    }

    const image = req.file ? req.file.filename : "";
    if (!image) {
      return res.status(400).json({ error: "Product image is required" });
    }

    // ✅ Parse sizes and colors
    let parsedSizes = [];
    let parsedColors = [];
    try {
      parsedSizes = JSON.parse(sizes || "[]");
      parsedColors = JSON.parse(colors || "[]");
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON in sizes or colors" });
    }

    // ✅ Create and save product
    const product = new Product({
      title,
      originalPrice,
      discount,
      image,
      sizes: parsedSizes,
      description,
      fabric,
      care,
      colors: parsedColors,
      category,
      isFeatured,
      subcategory,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: err.message });
  }
}
// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Products by Category/Subcategory
exports.getByCategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const products = await Product.find({ category, subcategory });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Only ActiveWear Products
exports.getActiveWear = async (req, res) => {
  try {
    const products = await Product.find({ subcategory: "ActiveWear" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.filterProduct = async (req, res) => {
  try {
    console.log("Incoming query:", req.query);
    const {
      search    = "",
      category,
      subcategory,
      isFeatured,
    } = req.query;

    const filter = {};

    if (search) {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // only apply featured filter if explicitly passed
    if (typeof isFeatured !== "undefined") {
      filter.isFeatured = isFeatured === "true";
    }

    console.log("Built Mongo filter:", filter);

    // now actually run it
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    console.error("filterProduct error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, originalPrice, sizes,
      description, fabric, care, colors,
      category, subcategory,isFeatured
    } = req.body;

    if (!allowedSubcategories.includes(subcategory)) {
      return res.status(400).json({ error: "Invalid subcategory" });
    }

    const updateData = {
      title,
      originalPrice,
      sizes: JSON.parse(sizes),
      description,
      fabric,
      care,
      isFeatured,
      colors: JSON.parse(colors),
      category,
      subcategory
    };

    if (req.file) {
      const product = await Product.findById(id);
      if (product.image) {
        fs.unlinkSync(`uploads/${product.image}`);
      }
      updateData.image = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image file if exists
    if (product.image) {
      const imagePath = path.join(__dirname, "../uploads", product.image);

      // Check if file exists before deleting
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ error: err.message });
  }
};
