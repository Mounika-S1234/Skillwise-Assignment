import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productAPI = {
  // Get all products
  getAll: (page = 1, limit = 10, sort = 'id', order = 'asc', category = null) => {
    let url = `/products?page=${page}&limit=${limit}&sort=${sort}&order=${order}`;
    if (category) {
      url += `&category=${category}`;
    }
    return apiClient.get(url);
  },

  // Search products
  search: (name) => {
    return apiClient.get(`/products/search?name=${encodeURIComponent(name)}`);
  },

  // Get inventory history for a product
  getHistory: (id) => {
    return apiClient.get(`/products/${id}/history`);
  },

  // Create a new product
  create: (data) => {
    return apiClient.post('/products', data);
  },

  // Update a product
  update: (id, data) => {
    return apiClient.put(`/products/${id}`, data);
  },

  // Delete a product
  delete: (id) => {
    return apiClient.delete(`/products/${id}`);
  },

  // Import products from CSV
  import: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return apiClient.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Export products as CSV
  export: () => {
    return apiClient.get('/products/export', {
      responseType: 'blob',
    });
  },
};

export default apiClient;
