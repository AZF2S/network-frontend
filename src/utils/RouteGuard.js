import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../api';

// Keep your original caching implementation
let authCache = {
    timestamp: 0,
    isAuthenticated: false,
    isEmailVerified: false,
    isMember: false,
    isAdmin: false
};

const TTL = 30 * 60 * 1000; // 30 minutes

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

        authCache = { timestamp: now, isAuthenticated, isEmailVerified, isMember, isAdmin };
        return authCache;
    } catch {
        authCache = { timestamp: now, isAuthenticated: false, isAdmin: false, isMember: false, isEmailVerified: false };
        return authCache;
    }
};

// Keeping original name but making it work with React Router v6
const RouteGuard = ({ children, user, uri, requires }) => {
    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const verify = async () => {
            if (!user?.uid) {
                setChecking(false);
                return;
            }
            const auth = await checkAuth(user.uid);
            setAuthorized(auth[requires]);
            setChecking(false);
        };
        verify();
    }, [user?.uid, requires]);

    if (checking) return null; // Or your preferred loading state

    return authorized ? children : <Navigate to={uri} replace />;
};

export const clearAuthCache = () => {
    authCache = { timestamp: 0, isAuthenticated: false, isAdmin: false, isMember: false, isEmailVerified: false };
};

export { RouteGuard };