import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import AddProduct from "./admin/pages/AddProduct";
import ProductList from "./admin/pages/ProductList";
import EditProduct from "./admin/pages/EditProduct";
import Orders from "./admin/pages/Orders";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders" element={<Orders />} />
          <Route path="edit/:id" element={<EditProduct />} />
        </Route>

        {/* Optional: 404 fallback */}
        <Route path="*" element={<div className="p-6 text-xl">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
