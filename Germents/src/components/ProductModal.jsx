import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../src/components/CartContext";

export default function ProductModal({ show, onClose, product }) {
  if (!show || !product) return null;
  const uploads=import.meta.env.VITE_UPLOADS;
  console.log(product,"product")
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setQuantity(1);
    setSelectedSize("");
    setActiveImage(0);
    setSelectedColor("");
  }, [product]);

  const colors = useMemo(() => {
    if (!product?.colors) return [];
    return Array.isArray(product.colors)
      ? product.colors
      : typeof product.colors === "string"
      ? product.colors.split(",").map((c) => c.trim())
      : [];
  }, [product]);

  const images = useMemo(() => {
    if (!product) return [];
    if (product.images && Array.isArray(product.images)) return product.images;
    if (product.image) return [product.image];
    return [];
  }, [product]);

  const handleQuantityChange = (value) => {
    const newValue = Math.max(1, Math.min(10, value));
    setQuantity(newValue);
  };

  const getColorValue = (colorName) => {
    const colorMap = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#10b981",
      yellow: "#f59e0b",
      black: "#000000",
      white: "#ffffff",
      gray: "#9ca3af",
      pink: "#ec4899",
      purple: "#8b5cf6",
      orange: "#f97316",
      brown: "#a52a2a",
      navy: "#000080",
      teal: "#008080",
      maroon: "#800000",
      beige: "#f5f5dc",
    };

    if (/^#([0-9A-F]{3}){1,2}$/i.test(colorName)) {
      return colorName;
    }

    return colorMap[colorName.toLowerCase()] || "#cccccc";
  };

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;
    setIsAddingToCart(true);

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity)) return;

    addToCart(product, parsedQuantity, selectedColor, selectedSize);

    setTimeout(() => {
      setIsAddingToCart(false);
      onClose();
      navigate("/Cartpage");
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white w-full max-w-6xl mx-auto rounded-xl shadow-2xl relative z-50 overflow-hidden flex flex-col lg:flex-row"
          style={{ maxHeight: "90vh", height: "90vh" }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-gray-500 hover:text-gray-700 transition-colors bg-white rounded-full p-1 sm:p-2 shadow-md"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Image Section - Fixed Height on Mobile, Flexible on Desktop */}
          <div className="w-full lg:w-1/2 bg-gray-50 p-4 flex flex-col">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-sm flex-shrink-0">
              {images[activeImage] && (
                <img
                  src={`${uploads}/${images[activeImage]}`}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === index ? "border-indigo-600 scale-105" : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section - Scrollable Content */}
          <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xl font-bold text-indigo-600">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
              </div>

              {product.category && (
                <div className="flex gap-2 mb-4">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                    {product.category}
                  </span>
                  {product.subcategory && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                      {product.subcategory}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Color Selection */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Color: {selectedColor || "Not selected"}</h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        title={color}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          selectedColor === color ? "border-indigo-600 scale-110" : "border-gray-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: getColorValue(color) }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Size: {selectedSize || "Not selected"}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white border-gray-300 text-gray-700 hover:border-indigo-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
                <div className="flex items-center border border-gray-300 rounded-md w-max overflow-hidden">
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 w-12 text-center">{quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-3">
                {product.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                )}

                {product.fabric && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Fabric & Materials</h3>
                    <p className="text-sm text-gray-600">{product.fabric}</p>
                  </div>
                )}

                {product.careInstructions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Care Instructions</h3>
                    <p className="text-sm text-gray-600">{product.careInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Add to Cart Button */}
            <div className="sticky bottom-0 bg-white pt-4 pb-2 -mx-6 px-6 border-t mt-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || isAddingToCart}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                  !selectedSize 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700"
                } flex items-center justify-center gap-2`}
              >
                {isAddingToCart ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}