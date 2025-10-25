// src/services/api.js
import axios from 'axios';

// ===============================
// CONFIGURATION AXIOS
// ===============================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Global response handler
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response) {
      const { status, data } = err.response;
      switch (status) {
        case 400:
          console.error('Validation error:', data.error);
          break;
        case 401:
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.dispatchEvent(new Event('storage'));
          break;
        case 403:
          if (data.error?.includes('connexion administrateur dédié')) {
            window.dispatchEvent(new CustomEvent('adminLoginRequired'));
          }
          console.error('Access denied:', data.error);
          break;
        case 404:
          console.error('Not found:', data.error);
          break;
        case 409:
          console.error('Conflict:', data.error);
          break;
        case 500:
          console.error('Server error:', data.error);
          break;
        default:
          console.error('Unknown error:', data.error);
      }
    }
    return Promise.reject(err);
  }
);

// ===============================
// AUTHENTIFICATION
// ===============================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  superAdminLogin: (data) => api.post('/auth/super-admin/login', data),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// ===============================
// ADMINISTRATION
// ===============================
export const adminAPI = {
  users: {
    list: (params) => api.get('/admin/users', { params }),
    toggleStatus: (userId, is_active) => api.patch(`/admin/users/${usersId}/status`),
  },
  withdrawals: {
    list: () => api.get('/admin/withdrawals'),
    approve: (id) => api.patch(`/admin/withdrawals/${id}/approve`),
    reject: (id, reason) => api.patch(`/admin/withdrawals/${id}/reject`, { reason }),
  },
  stats: {
    dashboard: () => api.get('/admin/stats/dashbord'),
    exportExcel: () => api.get('/admin/stats/export/excel', { responseType: 'blob' }),
    exportPDF: () => api.get('/admin/stats/export/pdf', { responseType: 'blob' }),
  },
  commission: {
    update: (settings) => api.put('/admin/commision/setting', settings),
  },
  settings: {
    get: () => api.get('/admin/settings'),
    update: (data) => api.put('/admin/settings', data),
  },
  logs: {
    get: () => api.get('/admin/logs'),
    getByAction: (action) => api.get(`/admin/logs/action/${action}`),
  },
};

// ===============================
// FREELANCE / MISSIONS
// ===============================
export const freelanceAPI = {
  missions: {
    list: (params) => api.get('/freelance/missions', { params }),
    getById: (id) => api.get(`/freelance/missions/${id}`),
    create: (data) => api.post('freelance/missions', data),
    apply: (data) => api.post('/freelance/missions/apply', data),
    acceptApplication: (applicationId) =>
      api.post('/freelance/missions/accept-application', { application_id: applicationId }),
    deliver: (data) => api.post('/freelance/missions/deliver', data),
    validateDelivery: (deliveryId) =>
      api.post('freelance/missions/validate-delivery', { delivery_id: deliveryId }),
  },
  applications: {
    my: () => api.get('/freelance/application/my'),
    byMission: (missionId) => api.get(`/freelance/applications/mission/${missionId}`),
  },
};

// ===============================
// PRODUITS (AVEC MÉTHODES AJOUTÉES)
// ===============================
export const productsAPI = {
  all: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  my: () => api.get('/products/my'),
  search: (query, params) =>
    api.get('/products/search', { params: { q: query, ...params } }),
  // ✅ MÉTHODES AJOUTÉES
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ===============================
// COMMANDES
// ===============================
export const ordersAPI = {
  all: () => api.get('/orders'),
  my: () => api.get('/orders/my'),
  sales: () => api.get('/orders/sales'),
  updateStatus: (id, status) => api.patch(`/ordres/${id}/status`),
};

// ===============================
// RETRAITS / WALLET (AVEC MÉTHODES AJOUTÉES)
// ===============================
export const withdrawalsAPI = {
  all: () => api.get('/withdrawals'),
  my: () => api.get('/withdrawals/my'),
  adminAll: () => api.get('/admin/withdrawals/all'),
  // ✅ MÉTHODES AJOUTÉES
  create: (data) => api.post('/withdrawals', data),
  cancel: (id) => api.delete(`${withdrawals}/${id}`),
};

// ===============================
// FICHIERS (SUPABASE / STORAGE)
// ===============================
export const filesAPI = {
  upload: (formData) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  signedUrl: (id) => api.get(`/files/${id}/signed-url`),
  publicUrl: (id) => api.get(`/files/${id}/public-url`),
  delete: (id) => api.delete(`/files/${id}`),
};

// ===============================
// PAIEMENT FEDAPAY
// ===============================
export const fedapayAPI = {
  adminKeys: () => api.get('/admin/fedapay/keys'),
  setKeys: (data) => api.post('/admin/fedapay/keys', data),
  initPayment: (data) => api.post('/fedapay/init-payment', data),
  initEscrow: (data) => api.post('/fedapay/init-ecrow', data),
};

// ===============================
// TRANSACTIONS / PAYMENTS
// ===============================
export const paymentsAPI = {
  transactions: () => api.get('/transactions'),
  getById: (id) => api.get(`/transaction/${id}`),
  init: (data) => api.post('/transactions/init', data),
  verify: (data) => api.post('/transactions/verify', data),
};

// ===============================
// NOTIFICATIONS
// ===============================
export const notificationsAPI = {
  my: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notification/${id}`),
  adminBulk: (data) => api.post('/admin/notifications/bulk', data),
  adminHistory: () => api.get('/admin/notifications/history'),
  adminDelete: (id) => api.delete(`/admin/notifications/${id}`),
  userStats: () => api.get('/admin/notifications/user-stats'),
};

// ===============================
// CHAT / MESSAGERIE
// ===============================
export const chatAPI = {
  conversations: () => api.get('/chat/conversations'),
  messages: (convId) => api.get(`/chat/conversations/${convId}/messages`),
  sendMessage: (data) => api.post('/chat/message/send', data),
};

// ===============================
// IA ASSISTANT
// ===============================
export const aiAPI = {
  sendMessage: (data) => api.post('/ai/assistant/message', data),
  generate: (data) => api.post('/ai/assistant/generate', data),
  conversations: {
    list: (params) => api.get('/ai/assistant/conversations', { params }),
    delete: (id) => api.delete(`/ai/assistant/conversation/${id}`),
  },
};

// ===============================
// IA EXTRA
// ===============================
export const aiExtraAPI = {
  toolsList: () => api.get('/ai/assistant/tools'),
  savePrompt: (data) => api.post('/ai/assistant/prompt/save', data),
};

// ===============================
// STATISTIQUES
// ===============================
export const statsAPI = {
  admin: () => api.get('/stats/admin'),
  user: () => api.get('/stats/user'),
  exportExcel: () => api.get('/stats/export/exel', { responseType: 'blob' }),
  exportPDF: () => api.get('/stats/export/pdf', { responseType: 'blob' }),
};

// ===============================
// FOURNISSEURS DE PAIEMENT
// ===============================
export const providersAPI = {
  active: () => api.get('/payment-providers/active'),
  adminAll: () => api.get('/admin/payment-providers'),
  adminById: (id) => api.get(`/admin/payment-providers/${id}`),
  create: (data) => api.post('/admin/payment-providers', data),
  update: (id, data) => api.put(`/admin/payment-providers/${id}`, data),
  delete: (id) => api.delete(`/admin/payment-providers/${id}`),
};

// ===============================
// CATÉGORIES
// ===============================
export const categoriesAPI = {
  all: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ===============================
// TAGS
// ===============================
export const tagsAPI = {
  all: (params) => api.get('/tags', { params }),
  create: (data) => api.post('/tags', data),
  delete: (id) => api.delete(`/tags/${id}`),
};

// ===============================
// EXPORT DEFAULT
// ===============================
export default api;
