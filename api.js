/**
 * api.js - Centralized API Service for ClimateGuard
 * Handles all server communications, authentication headers, and error handling.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const api = {
    /**
     * Generic fetch wrapper with auth header
     */
    async fetch(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const method = (options.method || 'GET').toUpperCase();
        const cacheOption = options.cache || (method === 'GET' ? 'no-store' : undefined);
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                ...(cacheOption ? { cache: cacheOption } : {}),
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle unauthorized (expired token)
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('currentUser');
                    // Removed automatic redirection to login page to allow public access
                }
                throw new Error(data.error || 'API Request failed');
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    },

    // Auth
    login: (name, password) => api.fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ name, password }),
    }),

    register: (userData) => api.fetch('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    // User Profile
    getProfile: () => api.fetch('/user/profile'),

    updateProfile: (profileData) => api.fetch('/user/update', {
        method: 'POST',
        body: JSON.stringify(profileData),
    }),

    // Data
    getSoilData: (district) => api.fetch(`/soil-data${district ? `?district=${district}` : ''}`),

    getForestData: (district) => api.fetch(`/forest-data${district ? `?district=${district}` : ''}`),

    predictRainfall: (temp, humidity, month) => api.fetch('/rainfall-predict', {
        method: 'POST',
        body: JSON.stringify({ temperature: temp, humidity, month }),
    }),

    recommendCrop: (data) => api.fetch('/crop-recommend', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    predictRisk: (data) => api.fetch('/risk-predict', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // SMS
    sendSmsAlert: (phone, message) => api.fetch('/send-alert', {
        method: 'POST',
        body: JSON.stringify({ phone, message }),
    }),

    sendSms: (phone, message) => api.fetch('/send-sms', {
        method: 'POST',
        body: JSON.stringify({ phone, message }),
    }),

    // District Alert — send SMS to all registered users in a district
    sendDistrictAlert: (district, message) => api.fetch('/send-district-alert', {
        method: 'POST',
        body: JSON.stringify({ district, message }),
    }),

    // Market Prices (cache-bust to always get fresh data)
    getMarketPrices: () => api.fetch(`/market-prices?_t=${Date.now()}`),
    getDistricts: () => api.fetch('/districts'),

    // Cache-bust weather to avoid stale data on normal reloads.
    getWeather: (district) => api.fetch(`/weather/${district}?_t=${Date.now()}`),
};
window.api = api;
export default api;
