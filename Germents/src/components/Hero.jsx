import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { hero5,hero6,hero8} from '../assets/Images/images';
const slides = [
  {
    title: "Active Wear for Every Move",
    description: "Discover premium performance wear designed for workouts, runs, and relaxation. Stay stylish and comfortable on the go.",
    image: hero5,
  },
  {
    title: "Elevate Your Fitness Look",
    description: "From breathable fabrics to flexible fits — gear up for your best performance in our latest collection.",
    image: hero6,
  },
  {
    title: "Style Meets Performance",
    description: "Train hard and look good doing it with our trend-setting, durable activewear essentials.",
    image: hero8,
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <img
            src={slides[current].image}
            alt="Slide background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {slides[current].title}
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl">
              {slides[current].description}
            </p>
            <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300">
              Shop Now
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroSection;
