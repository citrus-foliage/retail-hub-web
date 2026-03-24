import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import Navbar from "../../components/ui/Navbar.jsx";
import AccountInfo from "./AccountInfo.jsx";
import WishlistPage from "./WishlistPage.jsx";
import OrdersEmbed from "./OrdersEmbed.jsx";
import PageTransition from "../../components/ui/PageTransition.jsx";

const SECTIONS = ["Account Information", "Wishlist", "Order History"];

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState("Account Information");

  useEffect(() => {
    document.title = "My Account — Retail Hub";
    const section = searchParams.get("section");
    if (section && SECTIONS.includes(section)) {
      setActive(section);
    }
    return () => {
      document.title = "Retail Hub";
    };
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarStyle = {
    width: "240px",
    flexShrink: 0,
    borderRight: "1px solid #E0D8CC",
    padding: "48px 0",
  };

  const sidebarLinkStyle = (section) => ({
    display: "block",
    padding: "10px 32px",
    fontSize: "13px",
    color: active === section ? "#2C2C2C" : "#8C8070",
    fontWeight: active === section ? "500" : "400",
    cursor: "pointer",
    background: "none",
    border: "none",
    textAlign: "left",
    width: "100%",
    letterSpacing: "0.02em",
    fontFamily: "inherit",
  });

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8" }}>
        <Navbar />

        <div style={{ display: "flex", minHeight: "calc(100vh - 57px)" }}>
          <div style={sidebarStyle}>
            <div
              style={{
                padding: "0 32px 24px",
                borderBottom: "1px solid #E0D8CC",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#8C8070",
                }}
              >
                My Account
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#2C2C2C" }}>
                {user?.username}
              </p>
            </div>

            {SECTIONS.map((section) => (
              <button
                key={section}
                style={sidebarLinkStyle(section)}
                onClick={() => setActive(section)}
              >
                {section}
              </button>
            ))}

            <button
              style={{
                ...sidebarLinkStyle(""),
                color: "#8B2E2E",
                marginTop: "16px",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div style={{ flex: 1, padding: "48px 64px", maxWidth: "760px" }}>
            {active === "Account Information" && <AccountInfo />}
            {active === "Wishlist" && <WishlistPage />}
            {active === "Order History" && <OrdersEmbed />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Account;
