import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Products data
const products = [
  { 
    id: 1, 
    name: "Premium UI Kit", 
    price: 49, 
    image: "https://picsum.photos/300/200?random=1",
    category: "Design Templates",
    description: "Modern UI components for web applications",
    rating: 4.5
  },
  { 
    id: 2, 
    name: "Digital Illustration Pack", 
    price: 29, 
    image: "https://picsum.photos/300/200?random=2",
    category: "Illustrations",
    description: "100+ premium digital illustrations",
    rating: 4.8
  },
  { 
    id: 3, 
    name: "Brand Logo Pack", 
    price: 39, 
    image: "https://picsum.photos/300/200?random=3",
    category: "Logo Design",
    description: "Professional logo templates",
    rating: 4.3
  },
  { 
    id: 4, 
    name: "React Component Library", 
    price: 59, 
    image: "https://picsum.photos/300/200?random=4",
    category: "Code Templates",
    description: "Reusable React components",
    rating: 4.7
  },
  { 
    id: 5, 
    name: "Social Media Kit", 
    price: 19, 
    image: "https://picsum.photos/300/200?random=5",
    category: "Marketing",
    description: "Templates for social media posts",
    rating: 4.2
  },
  { 
    id: 6, 
    name: "3D Icon Set", 
    price: 35, 
    image: "https://picsum.photos/300/200?random=6",
    category: "Icons",
    description: "100+ 3D icons for modern designs",
    rating: 4.6
  }
];

// In-memory cart storage (in production, use a database)
let cart = [];

// Routes
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/cart", (req, res) => {
  res.json(cart);
});

app.post("/api/cart", (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
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
    cart,
    cartCount: cart.reduce((total, item) => total + item.quantity, 0)
  });
});

app.delete("/api/cart/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  cart = cart.filter(item => item.id !== productId);
  
  res.json({ 
    success: true, 
    message: "Item removed from cart",
    cart,
    cartCount: cart.reduce((total, item) => total + item.quantity, 0)
  });
});

app.put("/api/cart/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const { quantity } = req.body;
  
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
  }
  
  res.json({ 
    success: true, 
    cart,
    cartCount: cart.reduce((total, item) => total + item.quantity, 0)
  });
});

app.get("/", (req, res) => {
  res.json({ 
    message: "Digital Store API is running ✅",
    endpoints: {
      products: "/api/products",
      cart: "/api/cart",
      addToCart: "POST /api/cart",
      removeFromCart: "DELETE /api/cart/:id"
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🛍️ Digital Store Backend running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
});
