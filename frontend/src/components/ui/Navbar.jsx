import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCart } from "../../contexts/CartContext.jsx";
import CartDrawer from "./CartDrawer.jsx";
import AuthDrawer from "./AuthDrawer.jsx";

const SHOP_LINKS = [
  { label: "Featured", to: "/products?filter=featured" },
  { label: "Designers", to: "/products?filter=designers" },
  { label: "New Collection", to: "/products?filter=new" },
  { label: "Sales & Discounts", to: "/products?filter=sale" },
  { label: "All Products", to: "/products" },
];

const USER_LINKS = [
  { label: "Account Information", section: "Account Information" },
  { label: "Wishlist", section: "Wishlist" },
  { label: "Order History", section: "Order History" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const shopRef = useRef(null);
  const userRef = useRef(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    setUserOpen(false);
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target))
        setShopOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 48px",
    borderBottom: "1px solid #E0D8CC",
    backgroundColor: "#F5F0E8",
    position: "sticky",
    top: 0,
    zIndex: 150,
  };

  const brandStyle = {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    color: "#2C2C2C",
    fontWeight: "600",
    textDecoration: "none",
  };

  const navLinksStyle = {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  };

  const linkStyle = {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#2C2C2C",
    textDecoration: "none",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    fontFamily: "inherit",
    lineHeight: "inherit",
  };

  const adminStyle = {
    ...linkStyle,
    color: "#4A6741",
  };

  const dropdownWrapperStyle = {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    paddingTop: "12px",
    zIndex: 200,
  };

  const dropdownStyle = {
    backgroundColor: "#F5F0E8",
    border: "1px solid #E0D8CC",
    padding: "8px 0",
    minWidth: "180px",
    boxShadow: "0 8px 24px rgba(44,44,44,0.08)",
  };

  const dropdownItemStyle = {
    display: "block",
    padding: "10px 20px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#2C2C2C",
    textDecoration: "none",
    cursor: "pointer",
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <nav style={navStyle}>
        <Link to="/" style={brandStyle}>
          Retail Hub
        </Link>

        <div style={navLinksStyle}>
          <div
            ref={shopRef}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
            }}
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button style={linkStyle} onClick={() => navigate("/products")}>
              Shop
            </button>
            {shopOpen && (
              <div style={dropdownWrapperStyle}>
                <div style={dropdownStyle}>
                  {SHOP_LINKS.map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      style={dropdownItemStyle}
                      onClick={() => setShopOpen(false)}
                      onMouseEnter={(e) => (e.target.style.color = "#8C8070")}
                      onMouseLeave={(e) => (e.target.style.color = "#2C2C2C")}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button style={linkStyle} onClick={() => setCartOpen(true)}>
            Cart{cartCount > 0 && ` (${cartCount})`}
          </button>

          {user?.role === "Admin" && (
            <Link to="/admin" style={adminStyle}>
              Admin
            </Link>
          )}

          {user ? (
            <div
              ref={userRef}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseEnter={() => setUserOpen(true)}
              onMouseLeave={() => setUserOpen(false)}
            >
              <Link to="/account" style={linkStyle}>
                {user.username}
              </Link>
              {userOpen && (
                <div
                  style={{
                    ...dropdownWrapperStyle,
                    left: "auto",
                    right: 0,
                    transform: "none",
                  }}
                >
                  <div style={dropdownStyle}>
                    {USER_LINKS.map(({ label, section }) => (
                      <Link
                        key={label}
                        to={`/account?section=${encodeURIComponent(section)}`}
                        style={dropdownItemStyle}
                        onClick={() => setUserOpen(false)}
                        onMouseEnter={(e) => (e.target.style.color = "#8C8070")}
                        onMouseLeave={(e) => (e.target.style.color = "#2C2C2C")}
                      >
                        {label}
                      </Link>
                    ))}
                    <div
                      style={{
                        borderTop: "1px solid #E0D8CC",
                        margin: "8px 0",
                      }}
                    />
                    <button
                      style={{ ...dropdownItemStyle, color: "#8B2E2E" }}
                      onClick={handleLogout}
                      onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                      onMouseLeave={(e) => (e.target.style.opacity = "1")}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button style={linkStyle} onClick={() => setAuthOpen(true)}>
              Sign In
            </button>
          )}
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
