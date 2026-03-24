import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import API_URL from "../../services/api";

const OrdersEmbed = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.message || data.error || "Failed to fetch orders.",
          );
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
        Order History
      </h2>

      {loading && (
        <p style={{ fontSize: "12px", color: "#8C8070" }}>Loading…</p>
      )}
      {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p style={{ fontSize: "13px", color: "#8C8070" }}>No orders yet.</p>
      )}

      {!loading && orders.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                backgroundColor: "#FDFAF5",
                border: "1px solid #E0D8CC",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #E0D8CC",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 3px 0",
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#8C8070",
                    }}
                  >
                    Order
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#2C2C2C",
                      fontFamily: "monospace",
                    }}
                  >
                    {order._id}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      margin: "0 0 3px 0",
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#8C8070",
                    }}
                  >
                    Date
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#2C2C2C" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {order.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #E0D8CC",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 2px 0",
                        fontSize: "13px",
                        color: "#2C2C2C",
                      }}
                    >
                      {item.product?.name || "Product unavailable"}
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
                    {item.product?.price != null
                      ? `₱${(item.product.price * item.quantity).toLocaleString()}`
                      : "—"}
                  </p>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "14px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#8C8070",
                  }}
                >
                  Total
                </p>
                <p style={{ margin: 0, fontSize: "15px", color: "#2C2C2C" }}>
                  ₱{order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersEmbed;
