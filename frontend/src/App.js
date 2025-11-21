import React, { useState, useEffect } from 'react';
import { productAPI } from './api';
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import InventoryHistorySidebar from './components/InventoryHistorySidebar';
import { useToast } from './components/Toast';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { addToast, ToastContainer } = useToast();

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Extract unique categories from products
  useEffect(() => {
    const uniqueCategories = [...new Set(products.map((p) => p.category))].filter(Boolean);
    setCategories(uniqueCategories);
  }, [products]);

  const fetchProducts = async (search = '', category = '') => {
    setLoading(true);
    try {
      let response;
      if (search.trim()) {
        response = await productAPI.search(search);
      } else {
        response = await productAPI.getAll(1, 100, 'id', 'asc', category || undefined);
      }
      setProducts(response.data.data || []);
    } catch (error) {
      addToast('Failed to fetch products', 'error');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      fetchProducts(term, selectedCategory);
    } else if (selectedCategory) {
      fetchProducts('', selectedCategory);
    } else {
      fetchProducts();
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (searchTerm.trim()) {
      fetchProducts(searchTerm, category);
    } else {
      fetchProducts('', category);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productAPI.delete(id);
      addToast('Product deleted successfully', 'success');
      fetchProducts(searchTerm, selectedCategory);
    } catch (error) {
      addToast('Failed to delete product', 'error');
      console.error('Error deleting product:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await productAPI.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast('Products exported successfully', 'success');
    } catch (error) {
      addToast('Failed to export products', 'error');
      console.error('Error exporting products:', error);
    }
  };

  const handleImport = async (file) => {
    try {
      const response = await productAPI.import(file);
      addToast(
        `Import successful: ${response.data.added} added, ${response.data.skipped} skipped`,
        'success'
      );
      fetchProducts();
    } catch (error) {
      addToast('Failed to import products', 'error');
      console.error('Error importing products:', error);
    }
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleImport(file);
      }
    };
    input.click();
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsSidebarOpen(true);
  };

  const handleProductAdded = () => {
    addToast('Product saved successfully', 'success');
    fetchProducts(searchTerm, selectedCategory);
    setIsFormModalOpen(false);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>📦 Inventory Management System</h1>
        <div className="header-content">
          {/* Left Side: Search and Filters */}
          <div className="header-left">
            <input
              type="text"
              className="search-bar"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <select
              className="filter-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              className="btn btn-primary"
              onClick={() => setIsFormModalOpen(true)}
            >
              + Add New Product
            </button>
          </div>

          {/* Right Side: Import and Export */}
          <div className="header-right">
            <button
              className="btn btn-secondary"
              onClick={handleImportClick}
            >
              📤 Import
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleExport}
            >
              📥 Export
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <ProductTable
        products={products}
        categories={categories}
        onEdit={(product) => {
          setSelectedProduct(product);
          setIsFormModalOpen(true);
        }}
        onDelete={handleDeleteProduct}
        onSelectProduct={handleSelectProduct}
        onRefresh={() => fetchProducts(searchTerm, selectedCategory)}
        loading={loading}
      />

      {/* Modals and Sidebars */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedProduct(null);
        }}
        onProductAdded={handleProductAdded}
        editingProduct={selectedProduct}
      />

      <InventoryHistorySidebar
        productId={selectedProduct?.id}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        product={selectedProduct}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
