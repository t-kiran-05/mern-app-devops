import React from 'react';

export default function ProductCard({ 
  name, 
  price, 
  image, 
  description, 
  category, 
  rating, 
  onAddToCart 
}) {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    
    if (hasHalfStar) {
      stars.push('⭐');
    }
    
    return stars.join('');
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
        <div className="product-overlay">
          <button className="quick-view-btn" onClick={onAddToCart}>
            Quick Add 🛒
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">{category}</div>
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        {rating && (
          <div className="product-rating">
            {renderStars(rating)} ({rating})
          </div>
        )}
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
