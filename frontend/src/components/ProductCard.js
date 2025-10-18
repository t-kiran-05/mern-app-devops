export default function ProductCard({ name, price, image }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "15px",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <img src={image} alt={name} style={{ width: "100%", borderRadius: "10px" }} />
      <h3>{name}</h3>
      <p>${price}</p>
      <button style={{
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "5px"
      }}>Add to Cart</button>
    </div>
  );
}
