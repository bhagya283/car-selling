import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor to add token if needed
api.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
        const { token } = JSON.parse(user);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const carService = {
    getAll: () => api.get('/cars'),
    getById: (id: string) => api.get(`/cars/${id}`),
    create: (data: any) => api.post('/cars', data),
    updateStatus: (id: string, status: string) => api.patch(`/cars/${id}/status`, { status }),
    update: (id: string, data: any) => api.patch(`/cars/${id}`, data),
    delete: (id: string) => api.delete(`/cars/${id}`),
};

export const orderService = {
    create: (data: any) => api.post('/orders', data),
    getMyOrders: (userId?: string) => api.get(`/orders/me${userId ? `?userId=${userId}` : ''}`),
    getById: (id: string) => api.get(`/orders/${id}`),
    updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
    getYearlyStats: () => api.get('/orders/stats/year'),
    getYearlySales: () => api.get('/orders/stats/year'), // Mapping for easier recall
};

export const reportService = {
    getInvoice: (orderId: string) => api.get(`/reports/invoice/${orderId}`, { responseType: 'blob' }),
    getInspection: (data: any) => api.post('/reports/inspection', data, { responseType: 'blob' }),
    getAnnualReport: (year: number) => api.get(`/reports/yearly/${year}`, { responseType: 'blob' }),
};

export const bookingService = {
    getAll: (userId?: string) => api.get(`/bookings/me${userId ? `?userId=${userId}` : ''}`),
    create: (data: any) => api.post('/bookings', data),
    update: (id: string, data: any) => api.patch(`/bookings/${id}`, data),
    delete: (id: string) => api.delete(`/bookings/${id}`),
};

export const userService = {
    getMe: () => api.get('/users/me'),
    updateProfile: (id: string, data: any) => api.patch(`/users/${id}`, data),
    changePassword: (id: string, data: any) => api.post(`/users/${id}/change-password`, data),
    getStats: () => api.get('/admin/stats'), // Simulated endpoint for admin
};

export const contactService = {
    submit: (data: any) => api.post('/contacts', data),
    getAll: () => api.get('/contacts'),
    markContacted: (id: string) => api.put(`/contacts/${id}/contacted`),
    delete: (id: string) => api.delete(`/contacts/${id}`),
};

export default api;
