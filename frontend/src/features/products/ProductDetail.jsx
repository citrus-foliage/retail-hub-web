import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import API_URL from "../../services/api";
import Navbar from "../../components/ui/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import Toast from "../../components/ui/Toast.jsx";
import PageTransition from "../../components/ui/PageTransition.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, wishlist, toggleWishlistItem } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || data.error || "Product not found.");
        setProduct(data);
        document.title = `${data.name} — Retail Hub`;
      } catch (err) {
        setError(err.message);
        document.title = "Product — Retail Hub";
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      document.title = "Retail Hub";
    };
  }, [id]);

  const isWishlisted = product ? wishlist.includes(product._id) : false;
  const maxQty = product ? Number(product.countInStock) : 1;
  const onSale =
    product && product.salePrice != null && product.salePrice < product.price;
  const effectivePrice = onSale ? product.salePrice : product?.price;

  const showToast = (message) => setToast({ visible: true, message });

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++)
      addToCart({ ...product, price: effectivePrice });
    showToast(`${product.name} added to cart`);
  };

  const handleWishlist = async () => {
    if (!user || !product) return;
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

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.min(Math.max(1, prev + delta), maxQty));
  };

  return (
    <PageTransition>
      <Toast
        message={toast.message}
        visible={toast.visible}
        onHide={() => setToast({ visible: false, message: "" })}
      />

      <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8" }}>
        <Navbar />

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "40px 48px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "40px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#8C8070",
            }}
          >
            <Link
              to="/products"
              style={{ color: "#8C8070", textDecoration: "none" }}
            >
              Shop
            </Link>
            <span>→</span>
            <span style={{ color: "#2C2C2C" }}>
              {loading ? "…" : product?.name || "Product"}
            </span>
          </div>

          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "80px",
              }}
            >
              <div
                style={{
                  aspectRatio: "1",
                  backgroundColor: "#E8E0D0",
                  animation: "skeletonPulse 1.6s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  paddingTop: "8px",
                }}
              >
                {[
                  ["40%", "10px"],
                  ["60%", "32px"],
                  ["25%", "20px"],
                  ["100%", "13px"],
                  ["100%", "13px"],
                  ["100%", "13px"],
                ].map(([w, h], i) => (
                  <div
                    key={i}
                    style={{
                      width: w,
                      height: h,
                      backgroundColor: "#E8E0D0",
                      animation: `skeletonPulse 1.6s ease-in-out ${i * 0.08}s infinite`,
                    }}
                  />
                ))}
              </div>
              <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
            </div>
          )}

          {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

          {!loading && product && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "80px",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  backgroundColor: "#EDE8DF",
                  aspectRatio: "1",
                  overflow: "hidden",
                  border: "1px solid #E0D8CC",
                  cursor: "zoom-in",
                }}
                onMouseEnter={() => setImageZoomed(true)}
                onMouseLeave={() => setImageZoomed(false)}
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
                      transform: imageZoomed ? "scale(1.08)" : "scale(1)",
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
              </div>

              <div style={{ paddingTop: "8px" }}>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.3em",
                    color: "#8C8070",
                  }}
                >
                  Muddycap
                </p>
                <h1
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "32px",
                    fontWeight: "400",
                    color: "#2C2C2C",
                    letterSpacing: "0.02em",
                    lineHeight: "1.2",
                  }}
                >
                  {product.name}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "10px",
                    margin: "0 0 28px 0",
                  }}
                >
                  {onSale ? (
                    <>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          color: "#8B2E2E",
                          letterSpacing: "0.03em",
                        }}
                      >
                        ₱{product.salePrice.toLocaleString()}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          color: "#B0A898",
                          letterSpacing: "0.03em",
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
                        fontSize: "20px",
                        color: "#2C2C2C",
                        letterSpacing: "0.03em",
                      }}
                    >
                      ₱{product.price.toLocaleString()}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    borderTop: "1px solid #E0D8CC",
                    margin: "0 0 28px 0",
                  }}
                />

                {product.description && (
                  <p
                    style={{
                      margin: "0 0 32px 0",
                      fontSize: "14px",
                      color: "#5C5347",
                      lineHeight: "1.8",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {product.description}
                  </p>
                )}

                <p
                  style={{
                    margin: "0 0 24px 0",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: maxQty === 0 ? "#8B2E2E" : "#4A6741",
                  }}
                >
                  {maxQty === 0
                    ? "Out of stock"
                    : maxQty === 1
                      ? "1 left"
                      : `${maxQty} in stock`}
                </p>

                {maxQty > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0",
                      marginBottom: "16px",
                      border: "1px solid #2C2C2C",
                      width: "fit-content",
                    }}
                  >
                    <button
                      onClick={() => handleQtyChange(-1)}
                      disabled={quantity <= 1}
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "none",
                        border: "none",
                        cursor: quantity <= 1 ? "not-allowed" : "pointer",
                        fontSize: "16px",
                        color: quantity <= 1 ? "#B0A898" : "#2C2C2C",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        width: "40px",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#2C2C2C",
                        borderLeft: "1px solid #2C2C2C",
                        borderRight: "1px solid #2C2C2C",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQtyChange(1)}
                      disabled={quantity >= maxQty}
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "none",
                        border: "none",
                        cursor: quantity >= maxQty ? "not-allowed" : "pointer",
                        fontSize: "16px",
                        color: quantity >= maxQty ? "#B0A898" : "#2C2C2C",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Button
                    fullWidth
                    disabled={maxQty === 0}
                    onClick={handleAddToCart}
                  >
                    {maxQty === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>

                  {user && (
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={handleWishlist}
                    >
                      {isWishlisted
                        ? "♥ Remove from Wishlist"
                        : "♡ Add to Wishlist"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
