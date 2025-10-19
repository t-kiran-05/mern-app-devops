import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { 
    id: 1, 
    name: "Premium UI Kit", 
    price: 49, 
    image: "https://picsum.photos/300/200?random=1",
    category: "Design Templates",
    description: "Modern UI components for web applications"
  },
  { 
    id: 2, 
    name: "Digital Illustration Pack", 
    price: 29, 
    image: "https://picsum.photos/300/200?random=2",
    category: "Illustrations",
    description: "100+ premium digital illustrations"
  },
  { 
    id: 3, 
    name: "Brand Logo Pack", 
    price: 39, 
    image: "https://picsum.photos/300/200?random=3",
    category: "Logo Design",
    description: "Professional logo templates"
  },
  { 
    id: 4, 
    name: "React Component Library", 
    price: 59, 
    image: "https://picsum.photos/300/200?random=4",
    category: "Code Templates",
    description: "Reusable React components"
  },
  { 
    id: 5, 
    name: "Social Media Kit", 
    price: 19, 
    image: "https://picsum.photos/300/200?random=5",
    category: "Marketing",
    description: "Templates for social media posts"
  },
  { 
    id: 6, 
    name: "3D Icon Set", 
    price: 35, 
    image: "https://picsum.photos/300/200?random=6",
    category: "Icons",
    description: "100+ 3D icons for modern designs"
  }
];

let cart = [];

app.get("/api/products", (req, res) => res.json(products));
app.get("/api/cart", (req, res) => res.json(cart));

app.post("/api/cart", (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === parseInt(productId));
  
  if (product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    res.json({ success: true, cart });
  } else {
    res.status(404).json({ success: false, message: "Product not found" });
  }
});

app.delete("/api/cart/:id", (req, res) => {
  cart = cart.filter(item => item.id !== parseInt(req.params.id));
  res.json({ success: true, cart });
});

app.get("/", (req, res) => res.send("Backend running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
