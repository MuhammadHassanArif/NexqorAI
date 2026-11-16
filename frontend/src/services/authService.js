import { apiClient, refreshSession } from "./apiClient";
import { clearAccessToken, setAccessToken } from "./tokenStore";

// Talks to the backend's /api/auth routes. The forms and AuthContext use only these functions.
// Every function returns plain data and throws ApiError when something goes wrong.
export const authService = {
  async login({ email, password, rememberMe }) {
    const { data } = await apiClient.post("/auth/login", { email, password, rememberMe });
    setAccessToken(data.accessToken);
    return { user: data.user };
  },

  async signup({ fullName, email, password }) {
    // confirmPassword and plan are not sent: the backend does not need them
    const { data } = await apiClient.post("/auth/register", { fullName, email, password });
    setAccessToken(data.accessToken);
    return { user: data.user };
  },

  // Called when the website opens: is the visitor still logged in? (the refresh cookie answers this)
  async restoreSession() {
    try {
      const data = await refreshSession();
      return { user: data.user };
    } catch (error) {
      // 401 only means "not logged in", which is normal for a new visitor
      if (error.status === 401) return { user: null };
      throw error;
    }
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      clearAccessToken();
    }
  },
};