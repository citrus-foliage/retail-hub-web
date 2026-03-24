import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./authService";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/ui/PageTransition.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const emailRef = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign In — Retail Hub";
    emailRef.current?.focus();
    return () => {
      document.title = "Retail Hub";
    };
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
      navigate("/");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#F5F0E8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  };

  const containerStyle = { width: "100%", maxWidth: "360px" };

  const headingGroupStyle = { textAlign: "center", marginBottom: "40px" };

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

  const linkStyle = { color: "#2C2C2C", textDecoration: "underline" };

  return (
    <PageTransition>
      <div style={pageStyle}>
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
            <Link to="/register" style={linkStyle}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
