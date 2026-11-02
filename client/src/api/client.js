const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error(
      "Can't reach the Healthy Food API. Make sure the backend server is running on the configured VITE_API_URL."
    );
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // auth
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),

  // menu
  getMenu: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/menu${qs ? `?${qs}` : ""}`);
  },

  // orders
  createOrder: (payload, token) => request("/orders", { method: "POST", body: payload, token }),
  getMyOrders: (token) => request("/orders/my", { token }),
  getOrder: (id, token) => request(`/orders/${id}`, { token }),
  cancelOrder: (id, token) => request(`/orders/${id}/cancel`, { method: "PUT", token }),

  // admin — menu
  createMenuItem: (payload, token) => request("/menu", { method: "POST", body: payload, token }),
  updateMenuItem: (id, payload, token) => request(`/menu/${id}`, { method: "PUT", body: payload, token }),
  deleteMenuItem: (id, token) => request(`/menu/${id}`, { method: "DELETE", token }),

  // admin — orders
  getAllOrders: (params = {}, token) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/orders${qs ? `?${qs}` : ""}`, { token });
  },
  updateOrderStatus: (id, payload, token) => request(`/orders/${id}/status`, { method: "PUT", body: payload, token }),
};
