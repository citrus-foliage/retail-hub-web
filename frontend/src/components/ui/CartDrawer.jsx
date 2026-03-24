import { useCart } from "../../contexts/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";

const CartDrawer = ({ open, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const getEffectivePrice = (item) =>
    item.salePrice != null && item.salePrice < item.price
      ? item.salePrice
      : item.price;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + getEffectivePrice(item) * item.quantity,
    0,
  );

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(44, 44, 44, 0.3)",
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "420px",
          backgroundColor: "#F5F0E8",
          borderLeft: "1px solid #E0D8CC",
          zIndex: 201,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 28px",
            borderBottom: "1px solid #E0D8CC",
            flexShrink: 0,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#2C2C2C",
              fontWeight: "500",
            }}
          >
            Your Cart{" "}
            {cartItems.length > 0 &&
              `(${cartItems.reduce((s, i) => s + i.quantity, 0)})`}
          </p>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              color: "#8C8070",
              lineHeight: 1,
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 28px" }}>
          {cartItems.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "8px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  color: "#2C2C2C",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                Your cart is empty
              </p>
              <p style={{ fontSize: "12px", color: "#8C8070" }}>
                Add something from the collection.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "20px 0",
                  borderBottom: "1px solid #E0D8CC",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    flexShrink: 0,
                    backgroundColor: "#EDE8DF",
                    border: "1px solid #E0D8CC",
                    overflow: "hidden",
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

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: "0 0 2px 0",
                      fontSize: "13px",
                      color: "#2C2C2C",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "12px",
                      color: "#8C8070",
                    }}
                  >
                    ₱{getEffectivePrice(item).toLocaleString()}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #2C2C2C",
                      }}
                    >
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item._id, item.quantity - 1)
                            : removeFromCart(item._id)
                        }
                        style={{
                          width: "28px",
                          height: "28px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#2C2C2C",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          width: "32px",
                          textAlign: "center",
                          fontSize: "12px",
                          color: "#2C2C2C",
                          borderLeft: "1px solid #2C2C2C",
                          borderRight: "1px solid #2C2C2C",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        style={{
                          width: "28px",
                          height: "28px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#2C2C2C",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </button>
                    </div>

                    <p
                      style={{ margin: 0, fontSize: "12px", color: "#2C2C2C" }}
                    >
                      ₱
                      {(
                        getEffectivePrice(item) * item.quantity
                      ).toLocaleString()}
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
                        marginLeft: "auto",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div
            style={{
              padding: "20px 28px",
              borderTop: "1px solid #E0D8CC",
              flexShrink: 0,
              backgroundColor: "#F5F0E8",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "16px",
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
              <p
                style={{
                  margin: 0,
                  fontSize: "20px",
                  color: "#2C2C2C",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                ₱{totalPrice.toLocaleString()}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <Button fullWidth onClick={handleCheckout}>
                Checkout
              </Button>
              <Button variant="ghost" fullWidth onClick={handleViewCart}>
                View Full Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
