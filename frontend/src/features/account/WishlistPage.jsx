import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import API_URL from "../../services/api";
import Button from "../../components/ui/Button.jsx";
import { useCart } from "../../contexts/CartContext.jsx";

const WishlistPage = () => {
  const { user, wishlist, toggleWishlistItem } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API_URL}/users/wishlist`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.message || data.error || "Failed to fetch wishlist.",
          );
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await fetch(`${API_URL}/users/wishlist/${productId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      toggleWishlistItem(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "400",
          color: "#2C2C2C",
          margin: "0 0 32px 0",
          letterSpacing: "0.03em",
        }}
      >
        Wishlist
      </h2>

      {loading && (
        <p style={{ fontSize: "12px", color: "#8C8070" }}>Loading…</p>
      )}
      {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

      {!loading && products.length === 0 && (
        <p style={{ fontSize: "13px", color: "#8C8070" }}>
          Your wishlist is empty.
        </p>
      )}

      {!loading && products.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 0",
                borderBottom: "1px solid #E0D8CC",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  flexShrink: 0,
                  backgroundColor: "#EDE8DF",
                  border: "1px solid #E0D8CC",
                  overflow: "hidden",
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: "0 0 2px 0",
                    fontSize: "14px",
                    color: "#2C2C2C",
                  }}
                >
                  {product.name}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#8C8070" }}>
                  ₱{product.price.toLocaleString()}
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Button size="sm" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleRemove(product._id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
