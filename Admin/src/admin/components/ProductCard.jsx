import React from "react";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <img src={`https://jack-cruise-backend.onrender.com/uploads/${product.image}`} alt={product.title} className="h-48 w-full object-cover mb-2" />
      <h3 className="font-semibold">{product.title}</h3>
      <p>₹{product.price} <del className="text-sm text-gray-500">₹{product.originalPrice}</del></p>
      <p className="text-sm">{product.category} - {product.subcategory}</p>
      <button onClick={() => onDelete(product._id)} className="mt-2 bg-red-600 text-white px-3 py-1 rounded">Delete</button>
    </div>
  );
}
