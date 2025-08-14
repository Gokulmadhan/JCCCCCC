const base_url=import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
const API = axios.create({
  baseURL: base_url,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default API;
export const deleteProduct = async (id) => axios.delete(`${base_url}/products/${id}`);

export const getProducts = () => API.get('/products');
export const createProduct = (product) => API.post('/products', product);
export const updateProduct = (id,product) => API.put(`/products/${id}`, product);
// export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getOrders =async() => API.get('/orders');
export const updateOrderStatus =async({orderId,status}) => API.patch(`orders/${orderId}/status`,{ status});


