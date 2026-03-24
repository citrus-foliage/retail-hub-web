import { useEffect } from "react";
import { useCart } from "../../contexts/CartContext.jsx";
import { Link } from "react-router-dom";
import Navbar from "../../components/ui/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import PageTransition from "../../components/ui/PageTransition.jsx";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    document.title = "Your Cart — Retail Hub";
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
              Browse the collection and add something you love.
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
          style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}
        >
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "400",
              color: "#2C2C2C",
              marginBottom: "40px",
              letterSpacing: "0.03em",
            }}
          >
            Your Cart
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr 100px 100px 80px",
              gap: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid #2C2C2C",
            }}
          >
            {["", "Product", "Qty", "Price", ""].map((label, i) => (
              <p
                key={i}
                style={{
                  margin: 0,
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#8C8070",
                }}
              >
                {label}
              </p>
            ))}
          </div>

          {cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr 100px 100px 80px",
                gap: "16px",
                alignItems: "center",
                padding: "20px 0",
                borderBottom: "1px solid #E0D8CC",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  backgroundColor: "#EDE8DF",
                  border: "1px solid #E0D8CC",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
              </div>

              <div>
                <p
                  style={{
                    margin: "0 0 2px 0",
                    fontSize: "13px",
                    color: "#2C2C2C",
                  }}
                >
                  {item.name}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#8C8070" }}>
                  ₱{getEffectivePrice(item).toLocaleString()} each
                </p>
              </div>

              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) =>
                  updateQuantity(item._id, parseInt(e.target.value))
                }
                style={{
                  width: "48px",
                  padding: "6px",
                  border: "1px solid #2C2C2C",
                  backgroundColor: "transparent",
                  fontSize: "13px",
                  textAlign: "center",
                  outline: "none",
                }}
              />

              <p style={{ margin: 0, fontSize: "13px", color: "#2C2C2C" }}>
                ₱{(getEffectivePrice(item) * item.quantity).toLocaleString()}
              </p>

              <button
                onClick={() => removeFromCart(item._id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "10px",
                  color: "#8B2E2E",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: 0,
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <div
            style={{
              marginTop: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "20px",
            }}
          >
            <div
              style={{ display: "flex", gap: "40px", alignItems: "baseline" }}
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
              <p
                style={{
                  margin: 0,
                  fontSize: "22px",
                  color: "#2C2C2C",
                  fontWeight: "400",
                }}
              >
                ₱{totalPrice.toLocaleString()}
              </p>
            </div>
            <Link to="/checkout" style={{ width: "260px" }}>
              <Button fullWidth>Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
