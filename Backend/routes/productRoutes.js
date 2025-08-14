const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProduct,
  getAllProducts,
  getByCategory,
  getActiveWear,
  updateProduct,
  deleteProduct,
  filterProduct
} = require("../controllers/productController");

// Image upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes


router.get("/", filterProduct);
router.post("/", upload.single("image"), createProduct);
router.get("/all", getAllProducts);
router.get("/activewear", getActiveWear);
// router.get("/:category/:subcategory", getByCategory);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;