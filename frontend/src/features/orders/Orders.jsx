import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import API_URL from "../../services/api";
import Navbar from "../../components/ui/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import PageTransition from "../../components/ui/PageTransition.jsx";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Your Orders — Retail Hub";
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
    return () => {
      document.title = "Retail Hub";
    };
  }, []);

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8" }}>
        <Navbar />

        <div
          style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}
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
            Your Orders
          </h1>

          {loading && (
            <p
              style={{
                fontSize: "12px",
                color: "#8C8070",
                letterSpacing: "0.05em",
              }}
            >
              Loading…
            </p>
          )}

          {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

          {!loading && !error && orders.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
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
                No orders yet
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#8C8070",
                  margin: "0 0 8px 0",
                }}
              >
                When you place an order it will appear here.
              </p>
              <Link to="/products">
                <Button variant="secondary">Start Shopping</Button>
              </Link>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              {orders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    backgroundColor: "#FDFAF5",
                    border: "1px solid #E0D8CC",
                    padding: "28px 32px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "20px",
                      paddingBottom: "16px",
                      borderBottom: "1px solid #E0D8CC",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 4px 0",
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
                          letterSpacing: "0.05em",
                        }}
                      >
                        {order._id}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "9px",
                          textTransform: "uppercase",
                          letterSpacing: "0.2em",
                          color: "#8C8070",
                        }}
                      >
                        Date
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "#2C2C2C",
                        }}
                      >
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
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#2C2C2C",
                        }}
                      >
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
                      alignItems: "baseline",
                      paddingTop: "16px",
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
                    <p
                      style={{ margin: 0, fontSize: "16px", color: "#2C2C2C" }}
                    >
                      ₱{order.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Orders;
