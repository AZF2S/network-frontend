import axios from 'axios';
import config from './config';

// Storage keys
const USER_STORAGE_KEY = 'userData';
const CSRF_TOKEN_KEY = 'csrfToken';

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
authenticatedApi.interceptors.request.use(config => {
    const csrfToken = localStorage.getItem(CSRF_TOKEN_KEY);
    if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
});

// Auth-related endpoints
export const authApi = {
    // Special case: needs credentials to receive cookie but isn't validated yet
    login: async (credentials) => {
        const response = await api.post('/user/login', credentials, { withCredentials: true });
        if (response.data.success) {
            const { csrfToken, ...userData } = response.data.user;
            localStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        }
        return response;
    },
    getCurrentUser: () => {
        const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
        return authenticatedApi.get(`/user/${user?.uid}`);
    },
    isAdmin: () => authenticatedApi.get('/isAdmin'),
    logout: () => authenticatedApi.post('/user/logout').then(() => {
        localStorage.removeItem(CSRF_TOKEN_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    }),
    signUp: (userData) => api.post('/user/sign-up', userData),
    checkAccountAvailable: (data) => api.post('/user/is-available', data),
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
    getUserChats: () => authenticatedApi.get(`${config.NODEBB_URL}/api/v3/chats`),
    getUserTopics: (userslug) => authenticatedApi.get(`${config.NODEBB_URL}/api/user/${userslug}/topics`),
    getUserProfile: (userslug) => authenticatedApi.get(`${config.NODEBB_URL}/api/user/${userslug}`),
    logout: () => authApi.logout(),
    getChatMessages: (roomId) => authenticatedApi.get(`${config.NODEBB_URL}/api/v3/chats/${roomId}/messages`),
    getNotifications: () => authenticatedApi.get('/notifications'),
    getUserProfilePicture: (userslug) => authenticatedApi.get(`${config.NODEBB_URL}/api/user/${userslug}/picture`),
    getUserOrganizations: () => authenticatedApi.get('/verified-organizations'),
    getPendingMembers: () => authenticatedApi.get('/pending-members'),
    updateRecentlyVerified: (value) => authenticatedApi.put('/update-recently-verified', { value }),
    getUserSettings: () => authenticatedApi.get('/user-settings'),
    updateUserSettings: (data) => authenticatedApi.put('/user-settings', data),
    submitForm: (user) => authenticatedApi.put('/submit-form', { user }),
    renewMembership: (user) => authenticatedApi.put('/renew-membership', { user }),
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
    getUserOrgs: (orgs) => authenticatedApi.post('/user-orgs', orgs)
};

// Admin related endpoints - all protected
export const adminApi = {
    getPendingOrganizations: () => authenticatedApi.get('/pending-organizations'),
    getPendingMembers: () => authenticatedApi.get('/pending-members'),
    getVerifiedMembers: () => authenticatedApi.get('/verified-members'),
    acceptMembership: (data) => authenticatedApi.put('/accept-membership', data),
    denyMembership: (data) => authenticatedApi.put('/deny-membership', data),
    getGroupColors: () => authenticatedApi.get('/group-colors'),
    getContactListUsers: () => authenticatedApi.post('/contact-list-users', {})
};

// Forum related endpoints - all protected
export const forumApi = {
    getConfig: () => authenticatedApi.get(`${config.NODEBB_URL}/api/config`),
    updateSettings: (data) => authenticatedApi.put(`${config.NODEBB_URL}/api/v3/users/${data.uid}`, data),
    createChatRoom: (data) => authenticatedApi.post(`${config.NODEBB_URL}/api/v3/chats`, data),
    sendMessage: (roomId, message) => authenticatedApi.post(`${config.NODEBB_URL}/api/v3/chats/${roomId}`, { message }),
    leaveChatRoom: (roomId, data) => authenticatedApi.delete(`${config.NODEBB_URL}/api/v3/chats/${roomId}/users`, { data })
};

// Contact related endpoints - public
export const contactApi = {
    submitContactForm: (data) => api.post('/send-contact-email', data),
};

export default api;