import { createContext, useContext, useState, useEffect } from "react";
import { authApi, USER_STORAGE_KEY, CSRF_TOKEN_KEY } from "../api";
import {Navigate} from "react-router-dom";

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

const checkAuth = async (uid) => {
  const now = Date.now();
  if (now - authCache.timestamp < TTL) {
    return authCache;
  }

  try {
    const userResponse = await authApi.getCurrentUser(uid);

    const isAuthenticated = !!userResponse.data;
    const isEmailVerified = userResponse.data?.["email:confirmed"] === 1;
    const isMember = userResponse.data?.memberstatus === 'verified';

    let isAdmin = false;
    try {
      const adminResponse = await authApi.isAdmin(uid);
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

    console.log(`auth cache: ${authCache}`)
    return authCache;
  } catch {
    authCache = {
      timestamp: now,
      isAuthenticated: false,
      isAdmin: false,
      isMember: false,
      isEmailVerified: false
    };
    console.log(`error auth cache: ${authCache}`)
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

      const auth = await checkAuth(user.uid);
      setAuthState(auth);
      setIsAuthChecking(false);
    };

    verifyAuth();
  }, [user?.uid]);

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

  const value = {
    user,
    setUser,
    isLoading,
    logout,
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