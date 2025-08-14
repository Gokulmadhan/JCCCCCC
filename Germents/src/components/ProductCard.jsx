import React from 'react'

export default function ProductCard({ image, title, price }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-pink-600 font-bold mt-2">₹{price}</p>
      </div>
    </div>
  );
}
