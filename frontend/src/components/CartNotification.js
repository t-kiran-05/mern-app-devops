import React from 'react';

export default function CartNotification({ show, productName }) {
  if (!show) return null;

  return (
    <div className="notification">
      <div className="notification-content">
        <span className="notification-icon">✅</span>
        <span className="notification-text">
          <strong>{productName}</strong> added to cart!
        </span>
      </div>
    </div>
  );
}
