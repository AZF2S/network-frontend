import { createContext, useContext, useState, useEffect } from "react";
import { authApi, USER_STORAGE_KEY, CSRF_TOKEN_KEY } from "../api";

const AuthContext = createContext(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMembershipAcceptance, setShowMembershipAcceptance] = useState(false);

  // Check for user on initial load - only from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.uid) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch (error) {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Simple logout function
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(CSRF_TOKEN_KEY);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    setUser,
    isLoading,
    logout,
    showMembershipAcceptance,
    setShowMembershipAcceptance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}