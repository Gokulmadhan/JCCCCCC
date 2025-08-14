import React, {  useEffect, useReducer } from "react";
import axios from "axios";

// Constants
const API_URL = import.meta.env.VITE_BACKEND_URL || "https://jack-cruise-backend.onrender.com";
const UPLOAD_URL = "https://jack-cruise-backend.onrender.com/uploads";
const PRODUCT_CONFIG = {
  COLOR_OPTIONS: [
    "black", "white", "red", "blue", "green",
    "yellow", "pink", "gray", "navy", "beige", "other"
  ],
  SIZE_OPTIONS: ["xs", "s", "m", "l", "xl", "xxl"],
  CATEGORIES: ["women", "men"],
  SUBCATEGORIES: ["tops", "bottoms", "innerwear", "vests", "activewear"],
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"]
};


// Initial state
const initialState = {
  products: [],
  form: {
    title: "",
    discount: "",
    originalPrice: "",
    sizes: [],
    description: "",
   
    fabric: "",
    care: "",
    colors: [],
    category: "women",
    subcategory: "tops",
    isFeatured: false,
  },
  image: null,
  previewImage: null,
  editId: null,
  isLoading: false,
  error: null
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value
        }
      };
    case "TOGGLE_ARRAY_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value
        }
      };
    case "SET_IMAGE":
      return {
        ...state,
        image: action.image,
        previewImage: action.previewImage,
        error: null
      };
    case "SET_EDIT":
      return {
        ...state,
        form: action.form,
        editId: action.id,
        previewImage: action.previewImage,
        image: null,
        error: null
      };
    case "RESET_FORM":
      return {
        ...state,
        form: initialState.form,
        image: null,
        previewImage: null,
        editId: null,
        error: null
      };
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.products
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}

// API Service
const productService = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/products`);
    return res.data.map(p => ({
      ...p,
      image: p.image ? `${UPLOAD_URL}/${p.image}` : null,
      sizes: Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes || "[]"),
      colors: Array.isArray(p.colors) ? p.colors : JSON.parse(p.colors || "[]")
    }));
  },
  create: async (formData) => {
    const res = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },
  update: async (id, formData) => {
    const res = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },
  delete: async (id) => {
    await axios.delete(`${API_URL}/products/${id}`);
    return id;
  }
};

// Components
const ErrorDisplay = ({ error, onDismiss }) => (
  error && (
    <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
      <div className="flex justify-between items-center">
        <p>{error}</p>
        <button
          onClick={onDismiss}
          className="text-red-700 hover:text-red-900"
          aria-label="Dismiss error"
        >
          &times;
        </button>
      </div>
    </div>
  )
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ProductForm = ({ state, dispatch, onSubmit }) => {
  const { form, previewImage, editId, isLoading, error } = state;

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      field: e.target.name,
      value: e.target.value
    });
  };

  const handleCheckbox = (e, field) => {
    const value = e.target.value;
    let newArray;

    if (e.target.checked) {
      newArray = [...form[field], value];
    } else {
      newArray = form[field].filter(item => item !== value);
    }

    dispatch({
      type: "TOGGLE_ARRAY_FIELD",
      field,
      value: newArray
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!PRODUCT_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      dispatch({
        type: "SET_ERROR",
        error: "Please select a valid image file (JPEG, PNG, or WebP)"
      });
      return;
    }

    if (file.size > PRODUCT_CONFIG.MAX_IMAGE_SIZE) {
      dispatch({
        type: "SET_ERROR",
        error: "Image size should be less than 2MB"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({
        type: "SET_IMAGE",
        image: file,
        previewImage: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    dispatch({ type: "RESET_FORM" });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-10">
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {editId ? "Update Product" : "Add New Product"}
        </h2>

        {error && <ErrorDisplay error={error} onDismiss={() => dispatch({ type: "SET_ERROR", error: null })} />}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title*</label>
                <input
                  name="title"
                  onChange={handleChange}
                  value={form.title}
                  placeholder="e.g. Cotton T-Shirt"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "isFeatured",
                      value: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Mark as Featured</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                <input
                  name="originalPrice"
                  type="number"
                  onChange={handleChange}
                  value={form.originalPrice}
                  placeholder="e.g. 799"
                  min="0"
                  step="1"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">discount (%)</label>
                <input
                  name="discount"
                  type="number"
                  onChange={handleChange}
                  value={form.discount}
                  placeholder="e.g. 10%"
                  min="0"
                  step="1"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Image & Categories */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image{!editId && '*'}</label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="image-upload"
                      accept="image/*"
                      required={!editId}
                    />
                    <label
                      htmlFor="image-upload"
                      className="block px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
                    >
                      Choose File
                    </label>
                  </div>
                  {state.image && <span className="text-sm text-gray-500">{state.image.name}</span>}
                </div>

                {(previewImage || form.image) && (
                  <div className="mt-3">
                    <img
                      src={previewImage || form.image}
                      alt="Preview"
                      className="h-40 w-40 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                <select
                  name="category"
                  onChange={handleChange}
                  value={form.category}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                >
                  {PRODUCT_CONFIG.CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory*</label>
                <select
                  name="subcategory"
                  onChange={handleChange}
                  value={form.subcategory}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                >
                  {PRODUCT_CONFIG.SUBCATEGORIES.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors*</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {PRODUCT_CONFIG.COLOR_OPTIONS.map(color => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={color}
                    checked={form.colors.includes(color)}
                    onChange={(e) => handleCheckbox(e, "colors")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes*</label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_CONFIG.SIZE_OPTIONS.map(size => (
                <label key={size} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={size}
                    checked={form.sizes.includes(size)}
                    onChange={(e) => handleCheckbox(e, "sizes")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Text Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={form.description}
              placeholder="Detailed product description..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fabric & Materials</label>
              <input
                name="fabric"
                onChange={handleChange}
                value={form.fabric}
                placeholder="e.g. 100% Cotton"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
              <input
                name="care"
                onChange={handleChange}
                value={form.care}
                placeholder="e.g. Machine wash cold"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition duration-200`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : editId ? "Update Product" : "Add Product"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="w-full mt-3 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-800 transition duration-200"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductList = ({ products, isLoading, onEdit, onDelete }) => {
  if (isLoading && !products.length) return <LoadingSpinner />;

  if (products.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">No products found. Add your first product.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((p) => (
        <div key={p._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <div className="relative h-60">
            {p.image ? (
              <img
                src={p.image}
                alt={p.title}
                className="absolute h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{p.title}</h3>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                {p.category}
              </span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">{p.description}</p>

            <div className="flex items-center mb-3">
              <span className="text-green-600 font-bold">₹{p.price}</span>
              {p.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">₹{p.originalPrice}</span>
              )}
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Sizes:</p>
              <div className="flex flex-wrap gap-1">
                {p.sizes.map((size, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    {size}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Colors:</p>
              <div className="flex flex-wrap gap-1">
                {p.colors.map((color, i) => (
                  <span
                    key={i}
                    className="inline-block w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-auto">
              <button
                onClick={() => onEdit(p)}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition duration-200"
                aria-label={`Edit ${p.title}`}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(p._id)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition duration-200"
                aria-label={`Delete ${p.title}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Component
export default function ProductManagement() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "SET_LOADING", isLoading: true });
      try {
        const products = await productService.getAll();
        dispatch({ type: "SET_PRODUCTS", products });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          error: "Failed to load products. Please try again later."
        });
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", isLoading: true });
    dispatch({ type: "SET_ERROR", error: null });

    try {
      const fd = new FormData();
      Object.entries(state.form).forEach(([key, value]) => {
        if (key === 'image' && state.editId && !state.image) return;
        fd.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      });
      if (state.image) fd.append("image", state.image);

      let updatedProducts;
      if (state.editId) {
        const updatedProduct = await productService.update(state.editId, fd);
        updatedProducts = state.products.map(p =>
          p._id === state.editId ? {
            ...updatedProduct,
            image: updatedProduct.image ? `${UPLOAD_URL}/${updatedProduct.image}` : p.image,
            sizes: Array.isArray(updatedProduct.sizes) ? updatedProduct.sizes : JSON.parse(updatedProduct.sizes || "[]"),
            colors: Array.isArray(updatedProduct.colors) ? updatedProduct.colors : JSON.parse(updatedProduct.colors || "[]")
          } : p
        );
      } else {
        const newProduct = await productService.create(fd);
        updatedProducts = [...state.products, {
          ...state.form,
          _id: newProduct._id,
          image: newProduct.image ? `${UPLOAD_URL}/${newProduct.image}` : null,
          sizes: state.form.sizes,
          colors: state.form.colors
        }];
      }

      dispatch({ type: "SET_PRODUCTS", products: updatedProducts });
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        error: error.response?.data?.error || error.response?.data?.message || "Failed to save product. Please try again."
      });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  };

  const handleEdit = (product) => {
    dispatch({
      type: "SET_EDIT",
      form: {
        title: product.title,
        originalPrice: product.originalPrice,
        sizes: product.sizes,
        description: product.description,
        fabric: product.fabric,
        care: product.care,
        colors: product.colors,
        category: product.category,
        subcategory: product.subcategory
      },
      id: product._id,
      previewImage: product.image
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        dispatch({ type: "SET_LOADING", isLoading: true });
        await productService.delete(id);
        dispatch({
          type: "SET_PRODUCTS",
          products: state.products.filter(p => p._id !== id)
        });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          error: "Failed to delete product. Please try again."
        });
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <p className="text-gray-600 mt-2">
          {state.editId ? "Update existing product" : "Add new products to your store"}
        </p>
      </div>

      {/* Form Section */}
      <ProductForm
        state={state}
        dispatch={dispatch}
        onSubmit={handleSubmit}
      />

      {/* Product List Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Products ({state.products.length})
        </h2>

        <ProductList
          products={state.products}
          isLoading={state.isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}