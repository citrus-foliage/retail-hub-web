import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/authService";
import { useAuth } from "../../contexts/AuthContext";
import API_URL from "../../services/api";
import Input from "./Input";
import Button from "./Button";

const LoginPanel = ({ onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      const data = await loginUser(form);
      login(data);
      onClose();
      navigate("/");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = { padding: "40px 32px", flex: 1, overflowY: "auto" };

  const headingGroupStyle = { marginBottom: "40px" };

  const eyebrowStyle = {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.3em",
    color: "#8C8070",
    marginBottom: "8px",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "400",
    color: "#2C2C2C",
    letterSpacing: "0.05em",
  };

  const formStyle = { display: "flex", flexDirection: "column", gap: "24px" };

  const footerStyle = {
    textAlign: "center",
    fontSize: "11px",
    color: "#8C8070",
    letterSpacing: "0.05em",
    marginTop: "32px",
  };

  const linkStyle = {
    color: "#2C2C2C",
    textDecoration: "underline",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "11px",
    letterSpacing: "0.05em",
    padding: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={headingGroupStyle}>
        <p style={eyebrowStyle}>Retail Hub</p>
        <h1 style={titleStyle}>Welcome Back</h1>
      </div>

      {serverError && (
        <p style={{ color: "red", marginBottom: "16px" }}>{serverError}</p>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <Input
          ref={emailRef}
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        <Button
          type="submit"
          fullWidth
          disabled={loading}
          style={{ marginTop: "8px" }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <p style={footerStyle}>
        Don't have an account?{" "}
        <button style={linkStyle} onClick={onSwitchToRegister}>
          Create one
        </button>
      </p>
    </div>
  );
};

const RegisterPanel = ({ onSwitchToLogin }) => {
  const usernameRef = useRef(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Registration failed.");
      onSwitchToLogin();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = { padding: "40px 32px", flex: 1, overflowY: "auto" };

  const headingGroupStyle = { marginBottom: "40px" };

  const eyebrowStyle = {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.3em",
    color: "#8C8070",
    marginBottom: "8px",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "400",
    color: "#2C2C2C",
    letterSpacing: "0.05em",
  };

  const formStyle = { display: "flex", flexDirection: "column", gap: "24px" };

  const footerStyle = {
    textAlign: "center",
    fontSize: "11px",
    color: "#8C8070",
    letterSpacing: "0.05em",
    marginTop: "32px",
  };

  const linkStyle = {
    color: "#2C2C2C",
    textDecoration: "underline",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "11px",
    letterSpacing: "0.05em",
    padding: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={headingGroupStyle}>
        <p style={eyebrowStyle}>Retail Hub</p>
        <h1 style={titleStyle}>Create Account</h1>
      </div>

      {serverError && (
        <p style={{ color: "red", marginBottom: "16px" }}>{serverError}</p>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <Input
          ref={usernameRef}
          label="Username"
          name="username"
          placeholder="Your username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          required
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Min. 6 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
        <Button
          type="submit"
          fullWidth
          disabled={loading}
          style={{ marginTop: "8px" }}
        >
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>

      <p style={footerStyle}>
        Already have an account?{" "}
        <button style={linkStyle} onClick={onSwitchToLogin}>
          Sign in
        </button>
      </p>
    </div>
  );
};

const AuthDrawer = ({ open, onClose, initialView = "login" }) => {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (open) setView(initialView);
  }, [open, initialView]);

  const drawerTitle = view === "login" ? "Sign In" : "Create Account";

  const backdropStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(44, 44, 44, 0.3)",
    zIndex: 200,
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transition: "opacity 0.3s ease",
  };

  const drawerStyle = {
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
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 28px",
    borderBottom: "1px solid #E0D8CC",
    flexShrink: 0,
  };

  const headerLabelStyle = {
    margin: 0,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "#2C2C2C",
    fontWeight: "500",
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    color: "#8C8070",
    lineHeight: 1,
    padding: 0,
    fontFamily: "inherit",
  };

  return (
    <>
      <div onClick={onClose} style={backdropStyle} />

      <div style={drawerStyle}>
        <div style={headerStyle}>
          <p style={headerLabelStyle}>{drawerTitle}</p>
          <button onClick={onClose} style={closeButtonStyle}>
            ×
          </button>
        </div>

        {view === "login" ? (
          <LoginPanel
            onClose={onClose}
            onSwitchToRegister={() => setView("register")}
          />
        ) : (
          <RegisterPanel onSwitchToLogin={() => setView("login")} />
        )}
      </div>
    </>
  );
};

export default AuthDrawer;
