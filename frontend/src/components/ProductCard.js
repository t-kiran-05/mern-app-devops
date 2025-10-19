import React, { useState } from 'react';

export default function ProductCard({ id, name, price, image, description, category, rating }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId: id })
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      
      // Show success notification
      if (data.success) {
        // You can use a proper notification system here
        console.log(`${name} added to cart!`);
        
        // Dispatch custom event for notification
        window.dispatchEvent(new CustomEvent('cartUpdate', { 
          detail: { productName: name, type: 'add' } 
        }));
      }
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Star rating component
  const renderStars = (rating) => {
    if (!rating) return null;
    
    return (
      <div style={{ 
        color: '#ffc107', 
        fontSize: '14px', 
        margin: '5px 0' 
      }}>
        {'★'.repeat(Math.floor(rating))}
        {'☆'.repeat(5 - Math.floor(rating))}
        <span style={{ 
          color: '#666', 
          fontSize: '12px', 
          marginLeft: '5px' 
        }}>
          ({rating})
        </span>
      </div>
    );
  };

  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "15px",
      padding: "20px",
      textAlign: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      background: "white",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
    }}
    >
      {/* Category Badge */}
      {category && (
        <div style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "bold"
        }}>
          {category}
        </div>
      )}

      {/* Product Image */}
      <div style={{
        width: "100%",
        height: "200px",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "15px",
        position: "relative"
      }}>
        <img 
          src={image} 
          alt={name} 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        />
      </div>

      {/* Product Info */}
      <h3 style={{ 
        margin: "10px 0 5px 0", 
        fontSize: "18px", 
        fontWeight: "bold",
        color: "#333"
      }}>
        {name}
      </h3>

      {/* Description */}
      {description && (
        <p style={{ 
          color: "#666", 
          fontSize: "14px", 
          margin: "5px 0 10px 0",
          lineHeight: "1.4",
          minHeight: "40px"
        }}>
          {description.length > 80 ? `${description.substring(0, 80)}...` : description}
        </p>
      )}

      {/* Rating */}
      {renderStars(rating)}

      {/* Price and Add to Cart */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "15px"
      }}>
        <span style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#2ecc71",
          background: "linear-gradient(135deg, #2ecc71, #27ae60)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          ${price}
        </span>
        
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          style={{
            backgroundColor: isAdding ? "#6c757d" : "#007bff",
            background: isAdding ? "#6c757d" : "linear-gradient(135deg, #007bff, #0056b3)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "25px",
            cursor: isAdding ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            opacity: isAdding ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!isAdding) {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isAdding) {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }
          }}
        >
          {isAdding ? (
            <>
              <span style={{ marginRight: '5px' }}>⏳</span>
              Adding...
            </>
          ) : (
            <>
              <span style={{ marginRight: '5px' }}>🛒</span>
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Loading overlay */}
      {isAdding && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "15px"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "bold"
          }}>
            Adding to Cart...
          </div>
        </div>
      )}
    </div>
  );
}
