import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { setSessionExpiredHandler } from "../services/apiClient";

export const AuthContext = createContext(null);

// Tells the whole app who is logged in. isLoading is true until the backend has answered,
// so the navbar and the route guards do not flash the wrong screen.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // When the website opens, ask the backend if the visitor is still logged in
  useEffect(() => {
    let cancelled = false;

    authService
      .restoreSession()
      .then(({ user: restoredUser }) => {
        if (!cancelled) setUser(restoredUser);
      })
      .catch((error) => {
        // For example the backend is not running. The visitor is simply treated as logged out.
        console.warn("Could not check the login:", error.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // If a later refresh fails (the session ended), show the visitor as logged out everywhere
  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
    return () => setSessionExpiredHandler(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout request failed:", error.message);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: Boolean(user), setUser, logout }),
    [user, isLoading, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}