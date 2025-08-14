import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <nav className="space-y-3">
        <Link to="/admin/dashboard" className="block hover:text-yellow-400">Dashboard</Link>
        <Link to="/admin/add" className="block hover:text-yellow-400">Add Product</Link>
        <Link to="/admin/products" className="block hover:text-yellow-400">Product List</Link>
        <Link to="/admin/orders" className="block hover:text-yellow-400">Orders</Link>
      </nav>
    </aside>
  );
}
