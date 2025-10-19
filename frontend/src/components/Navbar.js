import React from 'react';

export default function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-icon">🛍️</span>
          <span className="nav-title">DigitalStore</span>
        </div>
        <div className="nav-cart" title="View Cart">
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </div>
      </div>
    </nav>
  );
}
