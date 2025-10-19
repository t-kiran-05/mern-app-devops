import React, { useEffect } from 'react';

export default function CartNotification({ show, productName, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="notification">
      <div className="notification-content">
        <span className="notification-icon">✅</span>
        <span className="notification-text">
          <strong>{productName}</strong> added to cart successfully!
        </span>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginLeft: 'auto',
            color: '#7f8c8d'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
