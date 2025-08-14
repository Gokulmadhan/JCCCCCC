import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash,
} from "lucide-react";
import ProductEditForm from "./ProductEditForm";
import API from "../api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  const fetchData = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      categoryFilter ? p.category === categoryFilter : true
    );
  }, [products, categoryFilter]);

  const columns = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-1 cursor-pointer">
            Title <ArrowUpDown className="w-4 h-4" />
          </div>
        ),
        accessorKey: "title",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        header: () => (
          <div className="flex items-center gap-1 cursor-pointer">
            Category <ArrowUpDown className="w-4 h-4" />
          </div>
        ),
        accessorKey: "category",
      },
      {
        header: () => (
          <div className="flex items-center gap-1 cursor-pointer">
            Price <ArrowUpDown className="w-4 h-4" />
          </div>
        ),
        accessorKey: "price",
        cell: (info) => <span>₹{info.getValue()}</span>,
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => setViewingProduct(product)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => setEditingProduct(product)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📦 Product List</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2 shadow-sm"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4 shadow-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="text-left px-4 py-3 text-sm font-semibold text-gray-600 cursor-pointer select-none"
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td className="px-4 py-3 text-sm text-gray-700" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <div>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          <strong>{table.getPageCount()}</strong>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Modal */}
    {viewingProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        {viewingProduct.title}
      </h3>

      <img
        src={`https://jack-cruise-backend.onrender.com/uploads/${viewingProduct.image}`}
        alt={viewingProduct.title}
        className="w-full h-auto rounded mb-4"
      />

      <div className="space-y-2 text-gray-700 text-sm">
        <p><strong>Product ID:</strong> {viewingProduct.productId}</p>
        <p><strong>Slug:</strong> {viewingProduct.slug}</p>
        <p><strong>Category:</strong> {viewingProduct.category}</p>
        <p><strong>Subcategory:</strong> {viewingProduct.subcategory}</p>
        <p><strong>Price:</strong> ₹{viewingProduct.price}</p>
        <p><strong>Original Price:</strong> ₹{viewingProduct.originalPrice}</p>
        <p><strong>Discount:</strong> {viewingProduct.discount}%</p>
        <p><strong>Sizes:</strong> {viewingProduct.sizes.join(", ")}</p>
        <p><strong>Colors:</strong> {viewingProduct.colors.join(", ")}</p>
        <p><strong>Fabric:</strong> {viewingProduct.fabric}</p>
        <p><strong>Care:</strong> {viewingProduct.care}</p>
        <p><strong>Description:</strong> {viewingProduct.description}</p>
        <p><strong>Featured:</strong> {viewingProduct.isFeatured ? "Yes" : "No"}</p>
        <p><strong>Created:</strong> {new Date(viewingProduct.createdAt).toLocaleString()}</p>
        <p><strong>Updated:</strong> {new Date(viewingProduct.updatedAt).toLocaleString()}</p>
      </div>

      <div className="mt-6 text-right">
        <button
          className="bg-gray-700  text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={() => setViewingProduct(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Edit Modal */}
      {editingProduct && (
        <ProductEditForm
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
