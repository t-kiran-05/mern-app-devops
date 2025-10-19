import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Authentic digital products with real mobile photos
const products = [
  { 
    id: 1, 
    name: "Premium Mobile UI Kit", 
    price: 49, 
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    category: "UI Templates",
    description: "Complete mobile app UI kit with 50+ screens",
    rating: 4.7
  },
  { 
    id: 2, 
    name: "E-commerce App Design", 
    price: 35, 
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    category: "App Design",
    description: "Modern e-commerce mobile app template",
    rating: 4.5
  },
  { 
    id: 3, 
    name: "Social Media Pack", 
    price: 29, 
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
    category: "Social Media",
    description: "Social media app UI components",
    rating: 4.3
  },
  { 
    id: 4, 
    name: "Finance Dashboard UI", 
    price: 45, 
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    category: "Dashboard",
    description: "Financial mobile app dashboard design",
    rating: 4.8
  },
  { 
    id: 5, 
    name: "Fitness App Template", 
    price: 39, 
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    category: "Fitness",
    description: "Complete fitness tracking app design",
    rating: 4.6
  },
  { 
    id: 6, 
    name: "Food Delivery App UI", 
    price: 42, 
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    category: "Food Delivery",
    description: "Food ordering app interface kit",
    rating: 4.4
  },
  { 
    id: 7, 
    name: "Travel Booking App", 
    price: 55, 
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
    category: "Travel",
    description: "Complete travel booking mobile app design",
    rating: 4.9
  },
  { 
    id: 8, 
    name: "Weather App Interface", 
    price: 25, 
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop",
    category: "Weather",
    description: "Beautiful weather app UI components",
    rating: 4.2
  }
];

// In-memory cart storage
let cart = [];

// Routes
app.get("/api/products", (req, res) => res.json(products));

app.get("/api/cart", (req, res) => {
  res.json(cart);
});

app.post("/api/cart", (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ 
        ...product, 
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }
    
    res.json({ 
      success: true, 
      message: `${product.name} added to cart`,
      cart: cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0)
    });
    
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

app.delete("/api/cart/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Item not found in cart" 
      });
    }
    
    cart.splice(itemIndex, 1);
    
    res.json({ 
      success: true, 
      message: "Item removed from cart",
      cart: cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0)
    });
    
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

// Clear entire cart
app.delete("/api/cart", (req, res) => {
  cart = [];
  res.json({ 
    success: true, 
    message: "Cart cleared",
    cart: cart,
    cartCount: 0
  });
});

app.get("/", (req, res) => {
  res.json({ 
    message: "Backend running ✅",
    endpoints: {
      products: "GET /api/products",
      cart: "GET /api/cart", 
      addToCart: "POST /api/cart",
      removeFromCart: "DELETE /api/cart/:id",
      clearCart: "DELETE /api/cart"
    },
    productsCount: products.length,
    cartCount: cart.length
  });
});

// Keep the same port and IP configuration
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("🛍️ Digital Store Backend running...");
  console.log("📍 Port:", process.env.PORT || 5000);
  console.log("🌐 IP: 0.0.0.0");
  console.log(`📦 ${products.length} digital products loaded`);
  console.log("🛒 Cart API endpoints ready");
});
