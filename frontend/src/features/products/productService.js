import API_URL from "../../services/api";

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to fetch products");
  }
  return res.json();
};
