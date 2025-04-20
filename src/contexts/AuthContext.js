import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api";

// Use the same storage key as defined in api.js
const USER_STORAGE_KEY = 'userData';
const AuthContext = createContext(undefined);

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
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAdmin(parsedUser.isAdmin || false);
            setIsAuthenticated(true);

            // Only fetch from server if we have a valid user ID
            if (parsedUser.uid) {
              try {
                const { data } = await authApi.getCurrentUser();

                if (data) {
                  setIsAuthenticated(true);
                  setUser(data);
                  setIsAdmin(data.groupTitleArray?.includes("administrators") || false);

                  // Update localStorage with fresh data
                  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
                    uid: data.uid,
                    username: data.username,
                    isAdmin: data.groupTitleArray?.includes("administrators") || false
                  }));
                }
              } catch (serverError) {
                console.log('Server validation failed:', serverError);
                // If server validation fails, clear local data
                setIsAuthenticated(false);
                setUser(null);
                setIsAdmin(false);
                localStorage.removeItem(USER_STORAGE_KEY);
              }
            }
          } catch (e) {
            // Invalid stored data
            console.log('Invalid stored user data:', e);
            localStorage.removeItem(USER_STORAGE_KEY);
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // No stored user - this is a guest session
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        // Error in the overall auth check process
        console.log('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem(USER_STORAGE_KEY);
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
      localStorage.removeItem(USER_STORAGE_KEY);
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