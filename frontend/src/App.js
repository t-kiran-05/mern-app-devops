import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import CartNotification from "./components/CartNotification";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ 
    show: false, 
    productName: "" 
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/products");
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
      const response = await fetch("http://localhost:5000/api/cart");
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
        setNotification({ 
          show: true, 
          productName: product.name 
        });
      } else {
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const closeNotification = () => {
    setNotification({ show: false, productName: "" });
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="app">
        <Navbar cartCount={getCartCount()} />
        <div className="loading">Loading amazing products... 🎨</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Navbar cartCount={getCartCount()} />
        <div className="error">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={fetchProducts}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
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
      <Navbar cartCount={getCartCount()} />
      
      <CartNotification 
        show={notification.show} 
        productName={notification.productName}
        onClose={closeNotification}
      />
      
      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">Digital Products Store</h1>
          <p className="products-subtitle">
            Discover amazing digital assets for your projects
          </p>
        </div>
        
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
