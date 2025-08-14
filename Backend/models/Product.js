const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
   
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,           // switch to Number for easier math
      default: 0,
      min: 0,
      max: 100,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    sizes: {
      type: [String],
      default: [],
      validate: v => v.every(s => ["xs","s","m","l","xl","xxl"].includes(s)),
    },
    description: {
      type: String,
      default: "",
    },
    fabric: {
      type: String,
      default: "",
    },
    care: {
      type: String,
      default: "",
    },
    colors: {
      type: [String],
      default: [],
      validate: v => v.every(c =>
        ["black","white","red","blue","green","yellow","pink","gray","navy","beige","other"].includes(c)
      ),
    },
    category: {
      type: String,
      enum: ["men", "women"],
      required: true,
    },
    subcategory: {
      type: String,
      enum: ["tops", "bottoms", "innerwear", "vests", "activewear"],
      required: true,
    },
    offer: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre‑save middleware
productSchema.pre("save", function (next) {
  // 1) Generate productId if new
  if (!this.productId) {
    this.productId = `pro_${uuidv4()}`;
  }

  // 2) Slugify title if changed
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // 3) Recalculate price from discount % of originalPrice
  if (this.isModified("discount") || this.isModified("originalPrice")) {
    const disc = Number(this.discount) || 0;
    this.price = Math.round(this.originalPrice * (1 - disc / 100));
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
