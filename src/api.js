import axios from 'axios';
import config from './config';

// Create base API instance
const api = axios.create({
    baseURL: `${config.PROTOCOL}${config.DOMAIN}${config.EXPRESS_PATH}`,
    withCredentials: true,  // This is crucial for cookies
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' // Prevent caching of authenticated requests
    }
});

// Fix double proxy route issue
api.interceptors.request.use(
    reqConfig => {
        const expressPath = config.EXPRESS_PATH;

        // Check if URL has duplicated base path
        if (reqConfig.url && reqConfig.url.startsWith(expressPath + expressPath)) {
            // Replace double occurrence with single
            const fixedUrl = expressPath + reqConfig.url.substring((expressPath + expressPath).length);
            console.log(`Fixing double path: ${reqConfig.url} → ${fixedUrl}`);
            reqConfig.url = fixedUrl;
        }

        reqConfig.withCredentials = true;
        return reqConfig;
    },
    error => Promise.reject(error)
);

// Ensure credentials are always sent
api.interceptors.request.use(
    config => {
        config.withCredentials = true;
        return config;
    },
    error => Promise.reject(error)
);

// Handle authentication errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Authentication related endpoints - Updated to match backend API expectations
export const authApi = {
    getCurrentUser: () => api.get('/user', { withCredentials: true }),
    isAdmin: () => api.get('/isAdmin', { withCredentials: true }),
    login: (credentials) => api.post('/user/login', credentials),
    logout: () => api.post('/user/logout'),
    signUp: (userData) => api.post('/user/sign-up', userData),
    checkAccountAvailable: (data) => api.post('/user/is-available', data),
    sendNewUserEmail: (data) => api.post('/user/new-user-email', data),
    updateNewUser: (data) => api.put('/user/new-user', data)
};

// Map related endpoints
export const mapApi = {
    getMapData: () => api.get('/map-data'),
    getOrganizationMembers: (orgId) => api.post('/get-organization-members', { orgId })
};

// Account related endpoints
export const accountApi = {
    updateUser: (updateData) => api.put('/user', updateData),
    getUserChats: () => api.get(`${config.NODEBB_URL}/api/v3/chats`),
    getUserTopics: (userslug) => api.get(`${config.NODEBB_URL}/api/user/${userslug}/topics`),
    getUserProfile: (userslug) => api.get(`${config.NODEBB_URL}/api/user/${userslug}`),
    logout: () => api.get('/logout'),
    getChatMessages: (roomId) => api.get(`${config.NODEBB_URL}/api/v3/chats/${roomId}/messages`),
    getNotifications: () => api.get('/notifications'),
    getUserProfilePicture: (userslug) => api.get(`${config.NODEBB_URL}/api/user/${userslug}/picture`),
    getUserOrganizations: () => api.get('/verified-organizations'),
    getPendingMembers: () => api.get('/pending-members'),
    getRemainingSteps: () => api.get('/user-checklist'),
    updateRecentlyVerified: (value) => api.put('/update-recently-verified', { value }),
    getUserSettings: () => api.get('/user-settings'),
    updateUserSettings: (data) => api.put('/user-settings', data),
    submitForm: (user) => api.put('/submit-form', { user }),
    renewMembership: (user) => api.put('/renew-membership', { user }),
    deleteMembership: () => api.put('/delete-membership')
};

// Resources related endpoints
export const resourcesApi = {
    getResources: () => api.get('/resources'),
    fetchHeaders: (fetchedResources) => api.post('/fetch-headers', { fetchedResources }),
    submitResource: (data) => api.post('/submit-resource', data)
};

// FAQ related endpoints
export const faqApi = {
    getFaqData: () => api.get('/faq')
};

// About related endpoints
export const aboutApi = {
    getBios: () => api.get('/about')
};

// User tags related endpoints
export const tagsApi = {
    getLocationFilters: () => api.get('/location-filters')
};

// Communities of practice related endpoints
export const copApi = {
    getCommunities: () => api.get('/communities-of-practice')
};

// Organization related endpoints
export const organizationApi = {
    getOrganizations: () => api.get('/organizations'),
    addOrganization: (data) => api.post('/add-organization', data),
    editOrganization: (data) => api.put('/edit-organization', data),
    acceptOrganization: (data) => api.put('/accept-organization', data),
    denyOrganization: (data) => api.put('/deny-organization', data),
    removeMember: (data) => api.put('/remove-member', data),
    getPendingOrganizations: () => api.get('/pending-organizations'),
    getVerifiedOrganizations: () => api.get('/verified-organizations'),
    getUserOrgs: (orgs) => api.post('/user-orgs', orgs)
};

// Admin related endpoints
export const adminApi = {
    getPendingOrganizations: () => api.get('/pending-organizations'),
    getPendingMembers: () => api.get('/pending-members'),
    getVerifiedMembers: () => api.get('/verified-members'),
    acceptMembership: (data) => api.put('/accept-membership', data),
    denyMembership: (data) => api.put('/deny-membership', data),
    getGroupColors: () => api.get('/group-colors'),
    getContactListUsers: () => api.post('/contact-list-users', {})
};

// Forum related endpoints
export const forumApi = {
    getConfig: () => api.get(`${config.NODEBB_URL}/api/config`),
    updateSettings: (data) => api.put(`${config.NODEBB_URL}/api/v3/users/${data.uid}`, data),
    createChatRoom: (data) => api.post(`${config.NODEBB_URL}/api/v3/chats`, data),
    sendMessage: (roomId, message) => api.post(`${config.NODEBB_URL}/api/v3/chats/${roomId}`, { message }),
    leaveChatRoom: (roomId, data) => api.delete(`${config.NODEBB_URL}/api/v3/chats/${roomId}/users`, { data })
};

// User progress related endpoints
export const progressApi = {
    getUserChecklist: () => api.get('/user-checklist'),
    updateChecklistStep: (step) => api.put('/update-checklist-step', { step }, { withCredentials: true })
};

// Contact related endpoints
export const contactApi = {
    submitContactForm: (data) => api.post('/send-contact-email', data),
};

export default api;