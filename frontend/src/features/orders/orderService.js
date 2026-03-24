import API_URL from "../../services/api";

export const getOrders = async () => {
  const res = await fetch(`${API_URL}/orders`);
  return res.json();
};
