import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "./productService";
import ProductCard from "./ProductCard";
import Navbar from "../../components/ui/Navbar.jsx";
import SkeletonCard from "../../components/ui/SkeletonCard.jsx";
import PageTransition from "../../components/ui/PageTransition.jsx";

const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [filterStock, setFilterStock] = useState("all"); // "all" | "in_stock" | "out_of_stock"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Shop — Retail Hub";
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const filter = searchParams.get("filter");
    if (filter === "sale") setFilterStock("sale");
  }, []);

  const getEffectivePrice = (p) =>
    p.salePrice != null && p.salePrice < p.price ? p.salePrice : p.price;

  const filtered = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(search.toLowerCase()));

      const matchesStock =
        filterStock === "all"
          ? true
          : filterStock === "in_stock"
            ? Number(p.countInStock) > 0
            : filterStock === "out_of_stock"
              ? Number(p.countInStock) === 0
              : filterStock === "sale"
                ? p.salePrice != null && p.salePrice < p.price
                : true;

      return matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      if (sort === "price_asc")
        return getEffectivePrice(a) - getEffectivePrice(b);
      if (sort === "price_desc")
        return getEffectivePrice(b) - getEffectivePrice(a);
      if (sort === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8" }}>
        <Navbar />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "24px",
              borderBottom: "1px solid #E0D8CC",
              paddingBottom: "20px",
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
                Collection
              </p>
              <h1
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "28px",
                  fontWeight: "400",
                  color: "#2C2C2C",
                  letterSpacing: "0.03em",
                }}
              >
                All Products
              </h1>
              {!loading && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "#B0A898",
                    letterSpacing: "0.05em",
                  }}
                >
                  {search || filterStock !== "all"
                    ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
                    : `${products.length} product${products.length !== 1 ? "s" : ""}`}
                </p>
              )}
            </div>

            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "1px solid #2C2C2C",
                padding: "6px 0",
                fontSize: "12px",
                color: "#2C2C2C",
                outline: "none",
                width: "200px",
                letterSpacing: "0.05em",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              marginBottom: "32px",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#8C8070",
              }}
            >
              Filter:
            </p>
            {[
              { label: "All", value: "all" },
              { label: "In Stock", value: "in_stock" },
              { label: "Out of Stock", value: "out_of_stock" },
              { label: "On Sale", value: "sale" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilterStock(value)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom:
                    filterStock === value
                      ? "1px solid #2C2C2C"
                      : "1px solid transparent",
                  cursor: "pointer",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: filterStock === value ? "#2C2C2C" : "#8C8070",
                  padding: "2px 0",
                  fontFamily: "inherit",
                  transition: "color 0.15s ease",
                }}
              >
                {label}
              </button>
            ))}

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#8C8070",
                }}
              >
                Sort:
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "1px solid #2C2C2C",
                  padding: "4px 0",
                  fontSize: "11px",
                  color: "#2C2C2C",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.05em",
                }}
              >
                {SORT_OPTIONS.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "24px" }}>{error}</p>
          )}

          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "2px",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && !error && (
            <div style={{ paddingTop: "40px", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "16px",
                  color: "#2C2C2C",
                  margin: "0 0 8px 0",
                }}
              >
                No products found
              </p>
              <p style={{ fontSize: "13px", color: "#8C8070", margin: 0 }}>
                {search
                  ? `No results for "${search}" — try a different search.`
                  : "Try adjusting the filters."}
              </p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "2px",
              }}
            >
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductList;
