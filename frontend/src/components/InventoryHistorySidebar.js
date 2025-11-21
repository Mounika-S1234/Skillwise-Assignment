import React, { useState, useEffect } from 'react';
import { productAPI } from '../api';

const InventoryHistorySidebar = ({ productId, isOpen, onClose, product }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && productId) {
      fetchHistory();
    }
  }, [isOpen, productId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.getHistory(productId);
      setHistory(response.data.data || []);
    } catch (err) {
      setError('Failed to load history');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Inventory History</h3>
        <button className="sidebar-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="sidebar-content">
        {product && (
          <div className="history-item" style={{ backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
            <p><span className="history-label">Product:</span> {product.name}</p>
            <p><span className="history-label">Current Stock:</span> {product.stock}</p>
          </div>
        )}

        {loading ? (
          <div className="spinner" style={{ marginTop: '40px' }}></div>
        ) : error ? (
          <div style={{ color: '#f44336', textAlign: 'center', padding: '20px' }}>
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <p>No inventory history found</p>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '15px', color: '#999', fontSize: '12px' }}>
              Showing {history.length} record(s)
            </p>
            {history.map((record, index) => (
              <div key={index} className="history-item">
                <p><span className="history-label">Date:</span> {formatDate(record.timestamp)}</p>
                <p><span className="history-label">Old Stock:</span> {record.old_stock}</p>
                <p><span className="history-label">New Stock:</span> {record.new_stock}</p>
                <p><span className="history-label">Changed By:</span> {record.changed_by || 'N/A'}</p>
                <p style={{ marginTop: '8px', color: '#4CAF50', fontWeight: '600' }}>
                  Change: {record.new_stock - record.old_stock > 0 ? '+' : ''}{record.new_stock - record.old_stock}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryHistorySidebar;
