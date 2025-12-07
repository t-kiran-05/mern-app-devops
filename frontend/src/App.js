import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: ""
  });
  const [showCart, setShowCart] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // Listen for cart update events from ProductCard
  useEffect(() => {
    const handleCartUpdate = (event) => {
      setNotification({ 
        show: true, 
        message: `${event.detail.productName} added to cart!` 
      });
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
      
      // Refresh cart count
      fetchCart();
    };

    window.addEventListener('cartUpdate', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/cart`);
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleRemoveItem = async (productId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/cart/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        setCart(result.cart);
        setNotification({
          show: true,
          message: result.message
        });
        setTimeout(() => setNotification({ show: false, message: "" }), 3000);
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Error removing item. Please try again.");
    }
  };

  const handleClearCart = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/cart`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        setCart(result.cart);
        setNotification({
          show: true,
          message: result.message
        });
        setTimeout(() => setNotification({ show: false, message: "" }), 3000);
      } else {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Error clearing cart. Please try again.");
    }
  };

  if (loading) {
  return (
    <div className="app">
      <Navbar cartCount={getCartCount()} onCartClick={handleCartClick} />
        <div className="loading">
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎨</div>
          Loading amazing digital products...
        </div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="app">
      <Navbar cartCount={getCartCount()} onCartClick={handleCartClick} />
        <div className="error">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={fetchProducts}
            style={{
              marginTop: '1rem',
              padding: '0.8rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 5px 15px rgba(118, 75, 162, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar cartCount={getCartCount()} onCartClick={handleCartClick} />
      
      {/* Simple Notification */}
      {notification.show && (
        <div 
          className="notification-simple"
          style={{
            position: "fixed",
            top: "90px",
            right: "20px",
            background: "linear-gradient(135deg, #2ecc71, #27ae60)",
            color: "white",
            padding: "15px 25px",
            borderRadius: "10px",
            boxShadow: "0 8px 25px rgba(46, 204, 113, 0.3)",
            zIndex: 1000,
            animation: "slideInRight 0.3s ease",
            fontWeight: "bold",
            fontSize: "14px",
            borderLeft: "4px solid #fff",
            backdropFilter: "blur(10px)"
          }}
        >
          ✅ {notification.message}
        </div>
      )}
      
      <div className="products-container">
        <div className="products-header">
        
          <h1 className="products-title">Digital Products Store for youu</h1>
          <p className="products-subtitle">
            Discover amazing digital assets for your creative projects
          </p>
          <div style={{ 
            marginTop: "1rem", 
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "14px"
          }}>
            {products.length} products available
          </div>
        </div>
        
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              description={product.description}
              category={product.category}
              rating={product.rating}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            color: "white", 
            marginTop: "3rem" 
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😔</div>
            <h3>No products found</h3>
            <p>Check back later for amazing digital products!</p>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
      )}
    </div>
  );
}

export default App;
