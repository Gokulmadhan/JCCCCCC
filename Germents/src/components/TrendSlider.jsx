// src/components/TrendSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

import { dress1, dress2, dress3 } from '../assets/Images/images';

const slides = [
  {
    title: 'ALL DAY TEES',
    desc: 'Stays fresh naturally',
    img: dress1,
    bg: 'bg-[#d4dcf1]',
  },
  {
    title: 'BRIEF & AIRY',
    desc: 'Feels like nothing',
    img: dress2,
    bg: 'bg-[#c9f2e3]',
  },
  {
    title: 'LACY LOVE',
    desc: 'Soft touch hipsters',
    img: dress3,
    bg: 'bg-[#f3d3e7]',
  },
  {
    title: 'ALL DAY TEES',
    desc: 'Stays fresh naturally',
    img: dress1,
    bg: 'bg-[#d4dcf1]',
  },
];

const slideVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.3 },
  }),
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const TrendSlider = () => {
  // Callback to apply inline style to pagination dots
  const handleSwiperInit = (swiper) => {
    const paginationEl = swiper.pagination?.el;
    if (paginationEl) {
      paginationEl.style.marginTop = '20px'; // Apply margin-top inline
    }
  };

  return (
    <div
      style={{
        width: '100%',
        padding: '40px 16px',
        maxWidth: '1280px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600' }}>
          <span style={{ color: '#4B5563' }}>ON-TREND </span>
          <span style={{ color: '#000', fontWeight: '700' }}>PICKS</span>
        </h2>
        <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '14px' }}>
          Explore Our Promising Line-up
        </p>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        dir="rtl"
        breakpoints={{
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="!overflow-visible"
        onInit={handleSwiperInit} // Apply inline margin to pagination
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover="hover"
              style={{
                backgroundColor: slide.bg.replace('bg-[#', '#').replace(']', ''),
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                minHeight: '320px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s',
              }}
            >
              {/* Text Content */}
              <motion.div
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                custom={index + 0.2}
                style={{
                  marginBottom: '16px',
                }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000' }}>
                  {slide.title.includes('&') ? (
                    <>
                      {slide.title.split('&')[0]}&nbsp;
                      <span style={{ fontWeight: '700' }}>{slide.title.split('&')[1]}</span>
                    </>
                  ) : (
                    slide.title
                  )}
                </h3>
                <p style={{ color: '#4B5563', marginTop: '8px', fontSize: '14px' }}>
                  {slide.desc}
                </p>
                <Link
                  to="/category/women/tops"
                  style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    border: '1px solid black',
                    borderRadius: '6px',
                    color: 'black',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'black';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'black';
                  }}
                >
                  EXPLORE NOW
                </Link>
              </motion.div>

              {/* Image */}
              <motion.div
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                custom={index + 0.4}
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={slide.img}
                  alt={slide.title}
                  style={{
                    height: '180px',
                    objectFit: 'contain',
                    transition: 'all 0.3s',
                  }}
                />
              </motion.div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrendSlider;
