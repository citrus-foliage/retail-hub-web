import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import API_URL from "../../services/api";
import Navbar from "../../components/ui/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import PageTransition from "../../components/ui/PageTransition.jsx";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Order Summary — Retail Hub";
    return () => {
      document.title = "Retail Hub";
    };
  }, []);

  const getEffectivePrice = (item) =>
    item.salePrice != null && item.salePrice < item.price
      ? item.salePrice
      : item.price;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + getEffectivePrice(item) * item.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          userId: user?._id,
          items: cartItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          totalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Failed to place order.");
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8" }}>
          <Navbar />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              gap: "12px",
              textAlign: "center",
              padding: "24px",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                fontWeight: "400",
                color: "#2C2C2C",
                margin: 0,
              }}
            >
              Your cart is empty
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#8C8070",
                margin: "0 0 16px 0",
              }}
            >
              Add some items before checking out.
            </p>
            <Link to="/products">
              <Button variant="secondary">Browse Products</Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8" }}>
        <Navbar />

        <div
          style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}
        >
          <p
            style={{
              margin: "0 0 6px 0",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#8C8070",
            }}
          >
            Review & Confirm
          </p>
          <h1
            style={{
              margin: "0 0 40px 0",
              fontSize: "26px",
              fontWeight: "400",
              color: "#2C2C2C",
              letterSpacing: "0.03em",
            }}
          >
            Order Summary
          </h1>

          <div style={{ borderTop: "1px solid #E0D8CC" }}>
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "18px 0",
                  borderBottom: "1px solid #E0D8CC",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 3px 0",
                      fontSize: "13px",
                      color: "#2C2C2C",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#8C8070",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Qty {item.quantity}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#2C2C2C" }}>
                  ₱{(getEffectivePrice(item) * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "20px 0",
              borderBottom: "1px solid #2C2C2C",
              marginBottom: "36px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8070",
              }}
            >
              Total
            </p>
            <p style={{ margin: 0, fontSize: "22px", color: "#2C2C2C" }}>
              ₱{totalPrice.toLocaleString()}
            </p>
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "16px", fontSize: "12px" }}>
              {error}
            </p>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Button fullWidth onClick={handlePlaceOrder} disabled={loading}>
              {loading ? "Placing Order…" : "Place Order"}
            </Button>
            <Link to="/cart">
              <Button variant="ghost" fullWidth>
                ← Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;
