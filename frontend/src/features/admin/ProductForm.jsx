import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import API_URL from "../../services/api";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const isEditing = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || "",
    salePrice: product?.salePrice || "",
    countInStock: product?.countInStock || "",
    image: product?.image || "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const autoSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : autoSlug(name),
    }));
    if (errors.name) setErrors({ ...errors, name: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.slug.trim()) newErrors.slug = "Slug is required.";
    if (!form.price) {
      newErrors.price = "Price is required.";
    } else if (isNaN(form.price) || Number(form.price) < 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (
      form.salePrice &&
      (isNaN(form.salePrice) || Number(form.salePrice) < 0)
    ) {
      newErrors.salePrice = "Sale price must be a positive number.";
    }
    if (form.salePrice && Number(form.salePrice) >= Number(form.price)) {
      newErrors.salePrice = "Sale price must be less than the regular price.";
    }
    if (
      form.countInStock !== "" &&
      (isNaN(form.countInStock) || Number(form.countInStock) < 0)
    ) {
      newErrors.countInStock = "Stock must be a positive number.";
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
      const url = isEditing
        ? `${API_URL}/products/${product._id}`
        : `${API_URL}/products`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          price: Number(form.price),
          salePrice: form.salePrice ? Number(form.salePrice) : null,
          countInStock: Number(form.countInStock) || 0,
          image: form.image || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || data.error || "Failed to save product.",
        );
      onSuccess(data.product);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "400",
          color: "#2C2C2C",
          margin: "0 0 28px 0",
          letterSpacing: "0.03em",
        }}
      >
        {isEditing ? "Edit Product" : "New Product"}
      </h3>

      {serverError && (
        <p style={{ color: "red", fontSize: "12px", marginBottom: "16px" }}>
          {serverError}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <Input
          label="Product Name"
          name="name"
          value={form.name}
          onChange={handleNameChange}
          error={errors.name}
          required
        />
        <Input
          label="Slug"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          error={errors.slug}
          hint="Auto-generated from name."
          required
        />
        <Input
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <Input
            label="Price (₱)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
            required
          />
          <Input
            label="Sale Price (₱)"
            name="salePrice"
            type="number"
            value={form.salePrice}
            onChange={handleChange}
            error={errors.salePrice}
            hint="Leave blank for no sale."
          />
        </div>
        <Input
          label="Stock Count"
          name="countInStock"
          type="number"
          value={form.countInStock}
          onChange={handleChange}
          error={errors.countInStock}
        />
        <Input
          label="Image URL"
          name="image"
          value={form.image}
          onChange={handleChange}
          hint="Paste a direct image URL."
        />

        {form.image && (
          <div>
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#8C8070",
              }}
            >
              Preview
            </p>
            <img
              src={form.image}
              alt="Preview"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "1px solid #E0D8CC",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            paddingTop: "8px",
          }}
        >
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving…"
              : isEditing
                ? "Save Changes"
                : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
