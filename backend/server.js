import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const products = [
  { id: 1, name: "UI Kit Template", price: 25, image: "https://picsum.photos/200" },
  { id: 2, name: "Digital Illustration", price: 15, image: "https://picsum.photos/201" },
  { id: 3, name: "Logo Pack", price: 10, image: "https://picsum.photos/202" }
];

app.get("/api/products", (req, res) => res.json(products));
app.get("/", (req, res) => res.send("Backend running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
