import React, { useEffect } from 'react';
import Hero from '../components/Hero';
// import OfferBanner from '../components/OfferBanner';
// import CategoryMenu from '../components/CategoryMenu';
// import ProductCard from '../components/ProductCard';
import TrendSlider from '../components/TrendSlider';
import ComfortMeetsCool from './categories/ComfortMeetsCool';
import Men from './categories/Men/ActiveWear';
import Women from './categories/Women/ActiveWear';
import Collections from './categories/Collections';
import JackCruiseBanner from '../components/JackCruiseBanner';
import JkyGrooveCard from '../components/JkyGrooveCard';

// import { dress1, dress2, dress3 } from '../assets/Images/images';
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from '../store/ProductSlice';
export default function Home() {
   const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

useEffect(() => {
    dispatch(fetchProducts({ isFeatured: true }));
}, [dispatch]);
  return (
    <div className='overflow-hidden' >
    <Hero />
      <TrendSlider />
      <ComfortMeetsCool />
      <Men />
      <Women />
      <JackCruiseBanner />
      <Collections />
      <JkyGrooveCard />
      {/* <OfferBanner />
      <CategoryMenu /> */}
      {/* <h2 className="text-2xl font-semibold mt-8 mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ProductCard image={dress1} title="Floral Dress" price="1299" />
        <ProductCard image={dress2} title="Casual T-Shirt" price="799" />
        <ProductCard image={dress3} title="Summer Shorts" price="599" />      */}
      {/* </div> */}
    </div>
  );
}
