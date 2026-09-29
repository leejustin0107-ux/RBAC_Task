const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (
      response.status === 401 &&
      endpoint !== "/auth/login" &&
      endpoint !== "/auth/me"
    ) {
      window.location.href = "/login";
    }
    const error = new Error(
      data.message || "Something went wrong"
    );
    error.status = response.status;
    throw error;
  }
  return data;
}