import React, { useState } from "react";
import { cool2, cool1 } from "../../assets/Images/images";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import { useSelector } from "react-redux";

const ComfortMeetsCool = () => {
  const { items, status } = useSelector((state) => state.products);
  const backend_url=import.meta.env.VITE_BACKEND_URL

  const menProducts = items?.filter((item) => item.category === "men") || [];
  const womenProducts = items?.filter((item) => item.category === "women") || [];

  const [selectedCategory, setSelectedCategory] = useState("men");
  const products = selectedCategory === "men" ? menProducts : womenProducts;
  const backgroundImage = selectedCategory === "men" ? cool2 : cool1;

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.15, duration: 0.5 },
    }),
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const Button = ({ children, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm sm:text-base rounded-full font-semibold transition ${
        active
          ? "bg-black/90 text-white"
          : selectedCategory === "men"
          ? "bg-black/70 text-white"
          : "bg-white text-black"
      }`}
    >
      {children}
    </button>
  );

  const Card = ({ product, index }) => {
    const renderStars = (rating = 0) => {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

      return (
        <div className="flex items-center space-x-1 text-yellow-400 text-sm">
          {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
          {halfStar && <span>☆</span>}
          {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">★</span>)}
        </div>
      );
    };

    return (
      <motion.div
        variants={cardVariants}
        custom={index}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="w-full max-w-[260px] h-[400px] flex-shrink-0"
      >
        <div className="bg-white text-black shadow-md rounded-xl p-3 h-full flex flex-col justify-between">
          <div className="relative overflow-hidden w-full h-[250px] flex justify-center items-center">
            <img
              src={product.image?.includes("http") ? product.image : `${backend_url}/uploads/${product.image}`}
              alt={product.title}
              className="h-full w-full object-cover rounded-md"
            />
            {product.count && (
              <div className="absolute top-2 left-2 bg-black text-white text-xs rounded-full px-2 py-1">
                {product.count}
              </div>
            )}
          </div>
          <div>
            <div className="mt-2 text-base font-semibold line-clamp-2">{product.title}</div>
            <div className="mt-1">{renderStars(product.rating)}</div>
            <div className="mt-1 text-lg font-bold">₹{product.price}</div>
          </div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium w-full mt-2">
            {product.tag || "Explore"}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center px-4 sm:px-10 lg:px-20 py-10 gap-10">
        {/* Left Text Block */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <div className="mb-6">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">COMFORT</h2>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">MEETS COOL</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Button active={selectedCategory === "men"} onClick={() => setSelectedCategory("men")}>Men</Button>
            <Button active={selectedCategory === "women"} onClick={() => setSelectedCategory("women")}>Women</Button>
          </div>
        </motion.div>

        {/* Right Slider */}
        <div className="w-full lg:w-1/2">
          {status === 'loading' ? (
            <p className="text-white">Loading products...</p>
          ) : (
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              spaceBetween={24}
              loop={true}
              centeredSlides={false}
              breakpoints={{
                0: { slidesPerView: 1 },
                480: { slidesPerView: 1.2 },
                640: { slidesPerView: 1.5 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2.5 },
              }}
            >
              <AnimatePresence initial={false}>
                {products.length ? (
                  products.map((product, idx) => (
                    <SwiperSlide
                      key={product.id || idx}
                      className="!flex justify-center items-center px-2"
                    >
                      <Card product={product} index={idx} />
                    </SwiperSlide>
                  ))
                ) : (
                  <div className="text-white text-center p-4">No products found</div>
                )}
              </AnimatePresence>
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComfortMeetsCool;
