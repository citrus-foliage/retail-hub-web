import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../services/api";
import Navbar from "../../components/ui/Navbar.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import PageTransition from "../../components/ui/PageTransition.jsx";

const EyeIcon = ({ visible }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = "Create Account — Retail Hub";
    usernameRef.current?.focus();
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
      navigate("/login");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#F5F0E8",
  };

  const contentStyle = {
    flex: 1,
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

  const eyeButtonStyle = (hasError) => ({
    position: "absolute",
    right: 0,
    bottom: hasError ? "22px" : "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#8C8070",
    padding: 0,
    display: "flex",
    alignItems: "center",
    lineHeight: 1,
  });

  return (
    <PageTransition>
      <div style={pageStyle}>
        <Navbar />
        <div style={contentStyle}>
          <div style={containerStyle}>
            <div style={headingGroupStyle}>
              <p style={eyebrowStyle}>Retail Hub</p>
              <h1 style={titleStyle}>Create Account</h1>
            </div>

            {serverError && (
              <p style={{ color: "red", marginBottom: "16px" }}>
                {serverError}
              </p>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" style={formStyle}>
              <Input
                ref={usernameRef}
                label="Username"
                name="username"
                autoComplete="off"
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
                autoComplete="off"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <div style={{ position: "relative" }}>
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={eyeButtonStyle(!!errors.password)}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  style={eyeButtonStyle(!!errors.confirmPassword)}
                >
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
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
              <Link to="/login" style={linkStyle}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
