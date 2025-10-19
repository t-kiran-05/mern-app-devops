import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import CartNotification from "./components/CartNotification";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState({ show: false, productName: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

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
        setNotification({ show: true, productName: product.name });
        setTimeout(() => setNotification({ show: false, productName: "" }), 3000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="app">
      <Navbar cartCount={getCartCount()} />
      
      <CartNotification 
        show={notification.show} 
        productName={notification.productName} 
      />
      
      <div className="products-container">
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
