import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import API_URL from "../../services/api";
import Navbar from "../../components/ui/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import ProductForm from "./ProductForm.jsx";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/products");
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch products.");
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (savedProduct) => {
    if (view === "create") {
      setProducts((prev) => [...prev, savedProduct]);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p._id === savedProduct._id ? savedProduct : p)),
      );
    }
    setView("list");
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setView("edit");
  };

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Failed to delete.");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8" }}>
      <Navbar />

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 48px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "40px",
            paddingBottom: "20px",
            borderBottom: "1px solid #E0D8CC",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: "#8C8070",
              }}
            >
              Admin
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "26px",
                fontWeight: "400",
                color: "#2C2C2C",
                letterSpacing: "0.03em",
              }}
            >
              Product Management
            </h1>
          </div>
          {view === "list" && (
            <Button onClick={() => setView("create")}>+ Add Product</Button>
          )}
          {view !== "list" && (
            <Button
              variant="ghost"
              onClick={() => {
                setView("list");
                setEditingProduct(null);
              }}
            >
              ← Back to List
            </Button>
          )}
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "12px", marginBottom: "20px" }}>
            {error}
          </p>
        )}

        {(view === "create" || view === "edit") && (
          <div
            style={{
              backgroundColor: "#FDFAF5",
              border: "1px solid #E0D8CC",
              padding: "36px",
              maxWidth: "600px",
            }}
          >
            <ProductForm
              product={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setView("list");
                setEditingProduct(null);
              }}
            />
          </div>
        )}

        {view === "list" && (
          <>
            {loading && (
              <p style={{ fontSize: "12px", color: "#8C8070" }}>
                Loading products…
              </p>
            )}

            {!loading && products.length === 0 && (
              <p style={{ fontSize: "13px", color: "#8C8070" }}>
                No products yet. Click "+ Add Product" to create your first one.
              </p>
            )}

            {!loading && products.length > 0 && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 80px 100px 160px",
                    gap: "16px",
                    padding: "0 16px 12px",
                    borderBottom: "1px solid #2C2C2C",
                  }}
                >
                  {["Product", "Price", "Stock", "Image", ""].map((col) => (
                    <p
                      key={col}
                      style={{
                        margin: 0,
                        fontSize: "9px",
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        color: "#8C8070",
                      }}
                    >
                      {col}
                    </p>
                  ))}
                </div>

                {products.map((product) => (
                  <div key={product._id}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 80px 80px 100px 160px",
                        gap: "16px",
                        alignItems: "center",
                        padding: "16px",
                        borderBottom: "1px solid #E0D8CC",
                        backgroundColor: "#FDFAF5",
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
                          {product.name}
                        </p>
                        {product.description && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: "11px",
                              color: "#8C8070",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "280px",
                            }}
                          >
                            {product.description}
                          </p>
                        )}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#2C2C2C",
                        }}
                      >
                        ₱{product.price.toLocaleString()}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color:
                            product.countInStock === 0 ? "#8B2E2E" : "#2C2C2C",
                        }}
                      >
                        {product.countInStock}
                      </p>
                      <div>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                              border: "1px solid #E0D8CC",
                            }}
                          />
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              fontSize: "11px",
                              color: "#B0A898",
                            }}
                          >
                            No image
                          </p>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteConfirm(product._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {deleteConfirm === product._id && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "12px 16px",
                          backgroundColor: "#FDF5F5",
                          borderBottom: "1px solid #E0D8CC",
                          borderLeft: "3px solid #8B2E2E",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#8B2E2E",
                          }}
                        >
                          Delete "{product.name}"? This cannot be undone.
                        </p>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(product._id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
