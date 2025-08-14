import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Replace these with your actual image imports
import { dress1, dress2, dress3 } from "../../assets/Images/images";

const collections = [
  { id: 1, name: "Innerwear", image: dress1, path: "innerwear" },
  { id: 2, name: "Tops", image: dress2, path: "tops" },
  { id: 3, name: "Bottoms", image: dress3, path: "bottoms" },
  { id: 4, name: "Vests", image: dress1, path: "vests" },
  { id: 5, name: "Loungewear", image: dress2, path: "bottoms" },
  { id: 6, name: "Activewear", image: dress3, path: "innerwear" },
  { id: 7, name: "Sleepwear", image: dress1, path: "vests" },
];

export default function Collections({ setMobileMenuOpen = () => {} }) {
  return (
    <div className="bg-white px-4 md:px-10 py-10 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-gray-800">
        More collections to explore
      </h2>

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          slidesPerView={1}
          spaceBetween={16}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 5, spaceBetween: 28 },
          }}
          style={{ paddingBottom: "3.2rem" }} // creates space for pagination
          onSwiper={(swiper) => {
            setTimeout(() => {
              const pagination = swiper.el.querySelector(".swiper-pagination");
              if (pagination) {
                pagination.style.position = "absolute";
                pagination.style.bottom = "0";
                pagination.style.left = "0";
                pagination.style.right = "0";
                pagination.style.marginTop = "1.25rem"; // equivalent to mt-5
              }
            }, 0);
          }}
        >
          {collections.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flex justify-center overflow-hidden">
                <Link
                  to={`/category/women/${item.path}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-[160px] md:w-[190px] lg:w-[200px] rounded-2xl bg-white border hover:shadow-md transition duration-200 block"
                >
                  <div className="bg-pink-50 rounded-t-2xl overflow-hidden h-64 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="text-gray-800 font-medium text-sm">
                      {item.name}
                    </p>
                    <span className="text-lg text-blue-500 font-bold hover:text-pink-600 transition">
                      →
                    </span>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
