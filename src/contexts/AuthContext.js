import { createContext, useContext, useState, useEffect } from "react";
import { authApi, USER_STORAGE_KEY, CSRF_TOKEN_KEY } from "../api";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(undefined);

let authCache = {
  timestamp: 0,
  isAuthenticated: false,
  isEmailVerified: false,
  isMember: false,
  isAdmin: false
};

const TTL = 30 * 60 * 1000; // 30 minutes

const clearAuthCache = () => {
  authCache = {
    timestamp: 0,
    isAuthenticated: false,
    isAdmin: false,
    isMember: false,
    isEmailVerified: false
  };
};

const checkAuth = async (user) => {
  const now = Date.now();
  if (now - authCache.timestamp < TTL) {
    return authCache;
  }

  try {
    // Pass user id directly from the context instead of getting from localStorage
    const userResponse = await authApi.getCurrentUser(user?.uid);

    const isAuthenticated = !!userResponse.data;
    const isEmailVerified = userResponse.data?.["email:confirmed"] === 1;
    const isMember = userResponse.data?.memberstatus === 'verified';

    let isAdmin = false;
    try {
      const adminResponse = await authApi.isAdmin();
      isAdmin = adminResponse.status === 200;
    } catch {
      // Failed admin check is expected for most users
    }

    authCache = {
      timestamp: now,
      isAuthenticated,
      isEmailVerified,
      isMember,
      isAdmin
    };

    console.log(`auth cache: ${authCache}`);
    return authCache;
  } catch (error) {
    console.error("Auth check error:", error);
    authCache = {
      timestamp: now,
      isAuthenticated: false,
      isAdmin: false,
      isMember: false,
      isEmailVerified: false
    };
    console.log(`error auth cache: ${authCache}`);
    return authCache;
  }
};

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMembershipAcceptance, setShowMembershipAcceptance] = useState(false);
  const [authState, setAuthState] = useState(authCache);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [loginState, setLoginState] = useState({
    isSigningIn: false,
    errorMessage: "",
  });

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

  // Check auth status whenever user changes
  useEffect(() => {
    const verifyAuth = async () => {
      if (!user?.uid) {
        setAuthState({
          ...authCache,
          isAuthenticated: false
        });
        setIsAuthChecking(false);
        return;
      }

      const auth = await checkAuth(user);
      setAuthState(auth);
      setIsAuthChecking(false);
    };

    verifyAuth();
  }, [user]);

  // State management moved from api.js to here
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      clearAuthCache();
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(CSRF_TOKEN_KEY);
    }
  };

  // State management moved from api.js to here
  const login = async (username, password) => {
    try {
      setLoginState({
        isSigningIn: true,
        errorMessage: "",
      });

      if (!username || !password) {
        setLoginState({
          isSigningIn: false,
          errorMessage: "Please enter both username and password",
        });
        return { success: false };
      }

      // Call the API with properly formatted object
      const data = { username, password };
      const response = await authApi.login(data);

      // Validate the response exists
      if (!response || !response.data) {
        console.error('Login response is invalid:', response);
        setLoginState({
          isSigningIn: false,
          errorMessage: "Unexpected server response. Please try again.",
        });
        return { success: false };
      }

      const loginResponse = response.data;

      if (!loginResponse.success) {
        setLoginState({
          isSigningIn: false,
          errorMessage: loginResponse.message || "Login failed",
        });
        return { success: false };
      }

      // Check if user data exists in the response
      if (!loginResponse.user) {
        console.error('User data missing in login response');
        setLoginState({
          isSigningIn: false,
          errorMessage: "Login succeeded but user data is missing",
        });
        return { success: false };
      }

      // Extract csrfToken and user data
      const { csrfToken, ...userData } = loginResponse.user;

      // Store csrfToken in localStorage - the interceptor in api.js will use it automatically
      localStorage.setItem(CSRF_TOKEN_KEY, csrfToken);

      // Create explicit user object with required fields
      const user = {
        uid: userData.uid,
        username: userData.username,
        email: userData.email,
        'email:confirmed': userData['email:confirmed'],
        memberstatus: userData.memberstatus,
        // Include other fields from userData
        ...userData
      };

      // Store user in localStorage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      // Set user in context
      setUser(user);

      // Reset login state
      setLoginState({
        isSigningIn: false,
        errorMessage: "",
      });

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error types appropriately
      let errorMessage;

      if (error.response) {
        // Server responded with an error status code
        errorMessage = error.response.data?.message || "Invalid username or password";
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please try again later.";
      } else {
        // Error in setting up the request
        errorMessage = error.message || "An error occurred during login";
      }

      setLoginState({
        isSigningIn: false,
        errorMessage,
      });

      return { success: false };
    }
  };

  const value = {
    user,
    setUser,
    isLoading,
    logout,
    login,
    loginState,
    showMembershipAcceptance,
    setShowMembershipAcceptance,
    isAuthChecking,
    ...authState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const RouteGuard = ({ children, uri, requires }) => {
  const { isAuthChecking, ...authState } = useAuth();

  if (isAuthChecking) return null;

  return authState[requires] ? children : <Navigate to={uri} replace />;
};