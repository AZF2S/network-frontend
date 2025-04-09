import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First try to restore from localStorage as a quick initial state
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAdmin(parsedUser.isAdmin || false);
            setIsAuthenticated(true);
          } catch (e) {
            // Invalid stored data
            localStorage.removeItem('user');
          }
        }

        // Then verify with the server
        const { data } = await authApi.getCurrentUser();

        if (data) {
          // User data exists, so they are authenticated
          setIsAuthenticated(true);
          setUser(data);
          setIsAdmin(data.groupTitleArray?.includes("administrators") || false);

          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify({
            uid: data.uid,
            username: data.username,
            isAdmin: data.groupTitleArray?.includes("administrators") || false
          }));
        }
      } catch (error) {
        // Error checking authentication, assume not authenticated
        console.log('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Add logout function for convenience
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      setUserSettings(null);
      localStorage.removeItem('user');
    }
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    isAdmin,
    setIsAdmin,
    userSettings,
    setUserSettings,
    isLoading,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}