import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import API_URL from "../../services/api";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const AccountInfo = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    setSuccess("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (form.password) {
      if (form.password.length < 6)
        newErrors.password = "Password must be at least 6 characters.";
      if (form.password !== form.confirmPassword)
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
    setSuccess("");
    try {
      const body = { username: form.username, email: form.email };
      if (form.password) body.password = form.password;

      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Update failed.");

      updateUser({ ...data, token: user.token });
      setForm({ ...form, password: "", confirmPassword: "" });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || data.error || "Failed to delete account.",
        );
      logout();
      navigate("/");
    } catch (err) {
      setDeleteError(err.message);
      setDeleteLoading(false);
    }
  };

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
        Account Information
      </h2>

      {serverError && (
        <p style={{ color: "red", fontSize: "12px", marginBottom: "16px" }}>
          {serverError}
        </p>
      )}
      {success && (
        <p style={{ color: "#4A6741", fontSize: "12px", marginBottom: "16px" }}>
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "420px",
        }}
      >
        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          required
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <div style={{ borderTop: "1px solid #E0D8CC", paddingTop: "24px" }}>
          <p
            style={{
              margin: "0 0 20px 0",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#8C8070",
            }}
          >
            Change Password
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <Input
              label="New Password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat new password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          style={{ alignSelf: "flex-end" }}
        >
          {loading ? "Saving…" : "Save Changes"}
        </Button>
      </form>

      <div
        style={{
          marginTop: "48px",
          paddingTop: "32px",
          borderTop: "1px solid #E0D8CC",
          maxWidth: "420px",
        }}
      >
        <p
          style={{
            margin: "0 0 8px 0",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#8C8070",
          }}
        >
          Danger Zone
        </p>
        <p
          style={{
            margin: "0 0 20px 0",
            fontSize: "13px",
            color: "#5C5347",
            lineHeight: "1.6",
          }}
        >
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>

        {deleteError && (
          <p style={{ color: "red", fontSize: "12px", marginBottom: "12px" }}>
            {deleteError}
          </p>
        )}

        {!deleteConfirm ? (
          <Button variant="danger" onClick={() => setDeleteConfirm(true)}>
            Delete Account
          </Button>
        ) : (
          <div
            style={{
              backgroundColor: "#FDF5F5",
              border: "1px solid #8B2E2E",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#8B2E2E",
                fontWeight: "500",
              }}
            >
              Are you sure? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting…" : "Yes, Delete My Account"}
              </Button>
              <Button variant="ghost" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
