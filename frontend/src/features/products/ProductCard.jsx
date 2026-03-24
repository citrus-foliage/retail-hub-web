import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import API_URL from "../../services/api";
import Toast from "../../components/ui/Toast.jsx";

const ProductCard = ({ product }) => {
  const { user, wishlist, toggleWishlistItem } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const isWishlisted = wishlist.includes(product._id);
  const isOutOfStock = Number(product.countInStock) === 0;
  const onSale = product.salePrice != null && product.salePrice < product.price;

  const showToast = (message) => setToast({ visible: true, message });

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await fetch(`${API_URL}/users/wishlist/${product._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toggleWishlistItem(product._id);
      showToast(
        isWishlisted
          ? `${product.name} removed from wishlist`
          : `${product.name} added to wishlist`,
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        visible={toast.visible}
        onHide={() => setToast({ visible: false, message: "" })}
      />
      <Link
        to={`/products/${product._id}`}
        style={{ textDecoration: "none" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            backgroundColor: "#FDFAF5",
            border: "1px solid #E0D8CC",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            opacity: isOutOfStock ? 0.75 : 1,
          }}
        >
          <div
            style={{
              backgroundColor: "#EDE8DF",
              height: "320px",
              overflow: "hidden",
              position: "relative",
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
                  transition: "transform 0.5s ease",
                  transform:
                    hovered && !isOutOfStock ? "scale(1.04)" : "scale(1)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#B0A898",
                  }}
                >
                  No image
                </span>
              </div>
            )}

            {isOutOfStock && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  backgroundColor: "#2C2C2C",
                  color: "#F5F0E8",
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  padding: "4px 10px",
                }}
              >
                Sold Out
              </div>
            )}

            {onSale && !isOutOfStock && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  backgroundColor: "#8B2E2E",
                  color: "#fff",
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  padding: "4px 10px",
                }}
              >
                Sale
              </div>
            )}

            {user && (
              <button
                onClick={handleWishlist}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(245, 240, 232, 0.9)",
                  border: "none",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  opacity: hovered || isWishlisted ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                {isWishlisted ? "♥" : "♡"}
              </button>
            )}
          </div>

          <div style={{ padding: "14px 16px 18px" }}>
            <h3
              style={{
                margin: "0 0 5px 0",
                fontSize: "13px",
                fontWeight: "400",
                color: "#2C2C2C",
                letterSpacing: "0.03em",
              }}
            >
              {product.name}
            </h3>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "8px" }}
            >
              {onSale ? (
                <>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#8B2E2E",
                      letterSpacing: "0.05em",
                    }}
                  >
                    ₱{product.salePrice.toLocaleString()}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#B0A898",
                      letterSpacing: "0.05em",
                      textDecoration: "line-through",
                    }}
                  >
                    ₱{product.price.toLocaleString()}
                  </p>
                </>
              ) : (
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#8C8070",
                    letterSpacing: "0.05em",
                  }}
                >
                  ₱{product.price.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
