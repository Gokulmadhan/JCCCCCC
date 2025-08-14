// src/pages/categories/Women/Tops.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../../../components/ProductModal";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Tops() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("https://jack-cruise-backend.onrender.com/api/products");
      const updated = res.data
        .filter((p) => p.category === "Women" && p.subcategory === "Tops")
        .map((p) => ({
          ...p,
          image: `https://jack-cruise-backend.onrender.com/uploads/${p.image}`,
          sizes: Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes),
          colors: Array.isArray(p.colors) ? p.colors : JSON.parse(p.colors),
        }));
      setProducts(updated);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          data-aos="zoom-in"
        >
          Stylish Tops Collection
        </motion.h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          Discover our trendy and fashionable tops for every occasion
        </p>
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -5 }}
                onClick={() => handleCardClick(product)}
                data-aos="fade-up"
                data-aos-delay={idx * 50}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.offer && (
                    <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                      {product.offer}
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    {product.colors?.join(", ")}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="text-pink-600 hover:text-pink-800 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tops found</h3>
          <p className="mt-1 text-gray-500">We couldn't find any products in this category.</p>
        </div>
      )}

      {/* View More Button */}
      {products.length > 0 && (
        <motion.button
          className="mt-14 mx-auto block bg-black text-white px-10 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          data-aos="fade-up"
        >
          View More
        </motion.button>
      )}

      {/* Modal */}
      <ProductModal show={showModal} onClose={handleCloseModal} product={selectedProduct} />
    </div>
  );
}