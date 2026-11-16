import axios from "axios";
import { ApiError } from "./ApiError";
import { clearAccessToken, getAccessToken, setAccessToken } from "./tokenStore";

// The ONLY place that knows the backend address.
// Development: "/api" (Vite passes it to the backend, see vite.config.js).
// Production: set VITE_API_URL in the frontend .env file.
const baseURL = import.meta.env.VITE_API_URL || "/api";

// withCredentials lets the browser send and receive the login (refresh token) cookie
export const apiClient = axios.create({ baseURL, withCredentials: true, timeout: 20000 });

// A second client without the interceptors below, used only for the refresh call.
// Otherwise a failing refresh could trigger another refresh, again and again.
const refreshClient = axios.create({ baseURL, withCredentials: true, timeout: 20000 });

// Turns any Axios error into our ApiError, so the rest of the app never sees Axios errors.
function toApiError(error) {
  if (error instanceof ApiError) return error;

  if (error.response) {
    const { status, data } = error.response;
    return new ApiError(
      data?.message || "Something went wrong. Please try again.",
      status,
      data?.fieldErrors,
      data?.code,
    );
  }

  return new ApiError(
    "Cannot reach the server. Please check your connection and try again.",
    0,
    undefined,
    "NETWORK_ERROR",
  );
}

// AuthContext registers a function here, so the whole app can log out when the session ends.
let sessionExpiredHandler = null;
export function setSessionExpiredHandler(handler) {
  sessionExpiredHandler = handler;
}

// Gets a new access token with the refresh cookie.
// If several requests need it at the same moment (for example React StrictMode runs an effect twice
// in development), only ONE call is sent and all of them wait for the same answer.
// This matters because the backend allows each refresh token to be used only once.
let refreshPromise = null;
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then((response) => {
        setAccessToken(response.data.accessToken);
        return response.data;
      })
      .catch((error) => {
        clearAccessToken();
        throw toApiError(error);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Every request automatically carries the access token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;

    // The access token expired (it lasts 15 minutes): get a new one and repeat the request once
    if (
      error.response?.status === 401 &&
      code === "TOKEN_EXPIRED" &&
      originalRequest &&
      !originalRequest._retried
    ) {
      originalRequest._retried = true;
      try {
        await refreshSession();
        originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // The session is really over, so the app must show the user as logged out
        if (sessionExpiredHandler) sessionExpiredHandler();
        throw refreshError;
      }
    }

    throw toApiError(error);
  },
);