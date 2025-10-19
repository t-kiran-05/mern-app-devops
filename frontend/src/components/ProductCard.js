import React from 'react';

export default function ProductCard({ name, price, image, description, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
        <div className="product-overlay">
          <button className="add-to-cart-btn" onClick={onAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <span className="product-price">${price}</span>
          <button className="buy-now-btn" onClick={onAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
