import axios from 'axios';
import config from './config';

// Storage keys for external use
export const USER_STORAGE_KEY = 'user';
export const CSRF_TOKEN_KEY = 'csrf';

// Base API - no credentials by default
const api = axios.create({
    baseURL: `${config.PROTOCOL}${config.DOMAIN}${config.EXPRESS_PATH}`,
    withCredentials: false,
    headers: {
        'Cache-Control': 'no-cache'
    }
});

// Authenticated API - always sends credentials and CSRF
const authenticatedApi = axios.create({
    baseURL: `${config.PROTOCOL}${config.DOMAIN}${config.EXPRESS_PATH}`,
    withCredentials: true,
    headers: {
        'Cache-Control': 'no-cache'
    }
});

// Add the interceptor only once, and it will use the token from localStorage as needed
authenticatedApi.interceptors.request.use(config => {
    const csrfToken = localStorage.getItem(CSRF_TOKEN_KEY);
    if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
});

// Auth-related endpoints
export const authApi = {
    // No state management - just return the response
    login: async (credentials) => {
        return api.post('/user/login', credentials, { withCredentials: true });
    },

    getCurrentUser: (userId) => {
        if (!userId) {
            return Promise.reject({ message: 'No user ID provided' });
        }
        return authenticatedApi.get(`/user?uid=${userId}`);
    },

    isAdmin: () => authenticatedApi.get('/isAdmin'),

    logout: () => authenticatedApi.post('/user/logout'),

    signUp: (userData) => api.post('/user/sign-up', userData),
    sendNewUserEmail: (data) => api.post('/user/new-user-email', data),
    updateNewUser: (data) => api.put('/user/new-user', data)
};

// Map related endpoints - public
export const mapApi = {
    getMapData: () => api.get('/map-data'),
    getOrganizationMembers: (orgId) => api.post('/get-organization-members', { orgId })
};

// Account related endpoints - all protected
export const accountApi = {
    updateUser: (updateData) => authenticatedApi.put('/user', updateData),
    getNotifications: () => authenticatedApi.get('/user/notifications'),
    getUserProfilePicture: (userslug) => authenticatedApi.get(`${config.NODEBB_URL}/api/user/${userslug}/picture`),
    getUserOrganizations: () => authenticatedApi.get('/verified-organizations'),
    getPendingMembers: () => authenticatedApi.get('/pending-members'),
    updateRecentlyVerified: (value) => authenticatedApi.put('/update-recently-verified', { value }),
    getUserSettings: () => authenticatedApi.get('/user-settings'),
    updateUserSettings: (data) => authenticatedApi.put('/user-settings', data),
    deleteMembership: () => authenticatedApi.put('/delete-membership')
};

// Resources related endpoints - public
export const resourcesApi = {
    getResources: () => api.get('/resources'),
    fetchHeaders: (fetchedResources) => api.post('/fetch-headers', { fetchedResources }),
    submitResource: (data) => api.post('/submit-resource', data)
};

// FAQ related endpoints - public
export const faqApi = {
    getFaqData: () => api.get('/faq')
};

// About related endpoints - public
export const aboutApi = {
    getBios: () => api.get('/about')
};

// Tags related endpoints - public
export const tagsApi = {
    getLocationFilters: () => api.get('/location-filters')
};

// Communities of practice related endpoints - public
export const copApi = {
    getCommunities: () => api.get('/communities-of-practice')
};

// Organization related endpoints - all protected
export const organizationApi = {
    getOrganizations: () => authenticatedApi.get('/organizations'),
    addOrganization: (data) => authenticatedApi.post('/add-organization', data),
    editOrganization: (data) => authenticatedApi.put('/edit-organization', data),
    acceptOrganization: (data) => authenticatedApi.put('/accept-organization', data),
    denyOrganization: (data) => authenticatedApi.put('/deny-organization', data),
    removeMember: (data) => authenticatedApi.put('/remove-member', data),
    getPendingOrganizations: () => authenticatedApi.get('/pending-organizations'),
    getVerifiedOrganizations: () => authenticatedApi.get('/verified-organizations'),
};

// Contact related endpoints - public
export const contactApi = {
    submitContactForm: (data) => api.post('/send-contact-email', data),
};

export default api;