import React, { useState, useEffect } from 'react';
import { productAPI } from '../api';

const ProductTable = ({
  products,
  categories,
  onEdit,
  onDelete,
  onSelectProduct,
  onRefresh,
  loading,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditValues({ ...product });
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: field === 'stock' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async (productId) => {
    try {
      await productAPI.update(productId, editValues);
      setEditingId(null);
      setEditValues({});
      onRefresh();
    } catch (error) {
      alert('Failed to update product: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const getStockStatusClass = (stock) => {
    return stock === 0 ? 'status-out-of-stock' : 'status-in-stock';
  };

  const getStockStatus = (stock) => {
    return stock === 0 ? 'Out of Stock' : 'In Stock';
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-text">
          <div className="spinner"></div>
          Loading products...
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <p>No products found. Try adjusting your filters or add a new product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className={editingId === product.id ? 'selected' : ''}
              onClick={() => !editingId && onSelectProduct(product)}
            >
              {/* Image Column */}
              <td>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </td>

              {/* Name Column */}
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="search-bar"
                    style={{ width: '100%' }}
                  />
                ) : (
                  product.name
                )}
              </td>

              {/* Unit Column */}
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editValues.unit}
                    onChange={(e) => handleEditChange('unit', e.target.value)}
                    className="search-bar"
                    style={{ width: '100%' }}
                  />
                ) : (
                  product.unit
                )}
              </td>

              {/* Category Column */}
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editValues.category}
                    onChange={(e) => handleEditChange('category', e.target.value)}
                    className="search-bar"
                    style={{ width: '100%' }}
                  />
                ) : (
                  product.category
                )}
              </td>

              {/* Brand Column */}
              <td>
                {editingId === product.id ? (
                  <input
                    type="text"
                    value={editValues.brand}
                    onChange={(e) => handleEditChange('brand', e.target.value)}
                    className="search-bar"
                    style={{ width: '100%' }}
                  />
                ) : (
                  product.brand
                )}
              </td>

              {/* Stock Column */}
              <td>
                {editingId === product.id ? (
                  <input
                    type="number"
                    value={editValues.stock}
                    onChange={(e) => handleEditChange('stock', e.target.value)}
                    className="search-bar"
                    style={{ width: '100%' }}
                    min="0"
                  />
                ) : (
                  editingId === product.id ? editValues.stock : product.stock
                )}
              </td>

              {/* Status Column */}
              <td>
                <span className={`status-badge ${getStockStatusClass(editingId === product.id ? editValues.stock : product.stock)}`}>
                  {getStockStatus(editingId === product.id ? editValues.stock : product.stock)}
                </span>
              </td>

              {/* Actions Column */}
              <td>
                <div className="actions-cell">
                  {editingId === product.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(product.id);
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel();
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(product);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this product?')) {
                            onDelete(product.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
