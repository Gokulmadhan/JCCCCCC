import React, { useState } from "react";
import API from "../api";

export default function ProductEditForm({ product, onClose }) {
  const [formData, setFormData] = useState({
    title: product.title || "",
    category: product.category || "",
    price: product.price || ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/products/${product._id}`, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-[400px] space-y-4"
      >
        <h3 className="text-xl font-bold">Edit Product</h3>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Title"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Category"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Price"
        />
        <div className="flex justify-end gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
