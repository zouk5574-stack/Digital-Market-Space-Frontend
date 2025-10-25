// src/services/api.js
// =============================================
// SERVICE API - BASCILE MOCK/PRODUCTION PAR COMMENTAIRES
// =============================================

// 🎯 POUR UTILISER LES MOCKS (développement sans backend) :
// → DÉCOMMENTEZ les imports mock et exports mock
// → COMMENTEZ les imports réels et exports réels

// 🎯 POUR UTILISER L'API RÉELLE (production/backend prêt) :
// → DÉCOMMENTEZ les imports réels et exports réels  
// → COMMENTEZ les imports mock et exports mock

// ===============================
// 🔄 IMPORTS MOCKS (décommentez pour utiliser les mocks)
// ===============================

import {
  mockAuthAPI, mockProductsAPI, mockCategoriesAPI, mockTagsAPI,
  mockStatsAPI, mockOrdersAPI, mockPaymentsAPI, mockFedapayAPI,
  mockFreelanceAPI, mockWithdrawalsAPI, mockAdminAPI, mockProvidersAPI,
  mockFilesAPI, mockNotificationsAPI, mockChatAPI, mockAIAssistantAPI,
  mockSecurityAPI
} from './mockApiService';

// ===============================
// 🔄 IMPORTS RÉELS (décommentez pour utiliser le backend réel)
// ===============================

/*
import axios from 'axios';

// ===============================
// CONFIGURATION AXIOS (pour API réelle)
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
*/

// ===============================
// ✅ EXPORTS MOCKS (décommentez pour utiliser les mocks)
// ===============================

export const authAPI = mockAuthAPI;
export const productsAPI = mockProductsAPI;
export const categoriesAPI = mockCategoriesAPI;
export const tagsAPI = mockTagsAPI;
export const statsAPI = mockStatsAPI;
export const ordersAPI = mockOrdersAPI;
export const paymentsAPI = mockPaymentsAPI;
export const fedapayAPI = mockFedapayAPI;
export const freelanceAPI = mockFreelanceAPI;
export const withdrawalsAPI = mockWithdrawalsAPI;
export const adminAPI = mockAdminAPI;
export const providersAPI = mockProvidersAPI;
export const filesAPI = mockFilesAPI;
export const notificationsAPI = mockNotificationsAPI;
export const chatAPI = mockChatAPI;
export const aiAssistantAPI = mockAIAssistantAPI;
export const securityAPI = mockSecurityAPI;

// ===============================
// ✅ EXPORTS RÉELS (décommentez pour utiliser le backend réel)
// ===============================

/*
// AUTHENTIFICATION
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  superAdminLogin: (data) => api.post('/auth/super-admin/login', data),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// ADMINISTRATION
export const adminAPI = {
  users: {
    list: (params) => api.get('/admin/users', { params }),
    toggleStatus: (userId, is_active) => api.patch(`/admin/users/${userId}/status`),
  },
  withdrawals: {
    list: () => api.get('/admin/withdrawals'),
    approve: (id) => api.patch(`/admin/withdrawals/${id}/approve`),
    reject: (id, reason) => api.patch(`/admin/withdrawals/${id}/reject`, { reason }),
  },
  stats: {
    dashboard: () => api.get('/admin/stats/dashboard'),
    exportExcel: () => api.get('/admin/stats/export/excel', { responseType: 'blob' }),
    exportPDF: () => api.get('/admin/stats/export/pdf', { responseType: 'blob' }),
  },
  commission: {
    update: (settings) => api.put('/admin/commission/setting', settings),
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

// FREELANCE / MISSIONS
export const freelanceAPI = {
  missions: {
    list: (params) => api.get('/freelance/missions', { params }),
    getById: (id) => api.get(`/freelance/missions/${id}`),
    create: (data) => api.post('/freelance/missions', data),
    apply: (data) => api.post('/freelance/missions/apply', data),
    acceptApplication: (applicationId) =>
      api.post('/freelance/missions/accept-application', { application_id: applicationId }),
    deliver: (data) => api.post('/freelance/missions/deliver', data),
    validateDelivery: (deliveryId) =>
      api.post('/freelance/missions/validate-delivery', { delivery_id: deliveryId }),
  },
  applications: {
    my: () => api.get('/freelance/applications/my'),
    byMission: (missionId) => api.get(`/freelance/applications/mission/${missionId}`),
  },
};

// PRODUITS
export const productsAPI = {
  all: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  my: () => api.get('/products/my'),
  search: (query, params) =>
    api.get('/products/search', { params: { q: query, ...params } }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// COMMANDES
export const ordersAPI = {
  all: () => api.get('/orders'),
  my: () => api.get('/orders/my'),
  sales: () => api.get('/orders/sales'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`),
};

// RETRAITS / WALLET
export const withdrawalsAPI = {
  all: () => api.get('/withdrawals'),
  my: () => api.get('/withdrawals/my'),
  adminAll: () => api.get('/admin/withdrawals/all'),
  create: (data) => api.post('/withdrawals', data),
  cancel: (id) => api.delete(`/withdrawals/${id}`),
};

// FICHIERS
export const filesAPI = {
  upload: (formData) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  signedUrl: (id) => api.get(`/files/${id}/signed-url`),
  publicUrl: (id) => api.get(`/files/${id}/public-url`),
  delete: (id) => api.delete(`/files/${id}`),
};

// PAIEMENT FEDAPAY
export const fedapayAPI = {
  adminKeys: () => api.get('/admin/fedapay/keys'),
  setKeys: (data) => api.post('/admin/fedapay/keys', data),
  initPayment: (data) => api.post('/fedapay/init-payment', data),
  initEscrow: (data) => api.post('/fedapay/init-escrow', data),
};

// TRANSACTIONS / PAYMENTS
export const paymentsAPI = {
  transactions: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  init: (data) => api.post('/transactions/init', data),
  verify: (data) => api.post('/transactions/verify', data),
};

// NOTIFICATIONS
export const notificationsAPI = {
  my: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  adminBulk: (data) => api.post('/admin/notifications/bulk', data),
  adminHistory: () => api.get('/admin/notifications/history'),
  adminDelete: (id) => api.delete(`/admin/notifications/${id}`),
  userStats: () => api.get('/admin/notifications/user-stats'),
};

// CHAT / MESSAGERIE
export const chatAPI = {
  conversations: () => api.get('/chat/conversations'),
  messages: (convId) => api.get(`/chat/conversations/${convId}/messages`),
  sendMessage: (data) => api.post('/chat/message/send', data),
};

// IA ASSISTANT
export const aiAssistantAPI = {
  conversations: {
    list: (params) => api.get('/ai/assistant/conversations', { params }),
    getById: (id) => api.get(`/ai/assistant/conversations/${id}`),
    create: (data) => api.post('/ai/assistant/conversations', data),
    delete: (id) => api.delete(`/ai/assistant/conversations/${id}`),
  },
  sendMessage: (conversationId, message) => 
    api.post(`/ai/assistant/conversations/${conversationId}/messages`, { message }),
  generate: (data) => api.post('/ai/assistant/generate', data),
};

// SÉCURITÉ
export const securityAPI = {
  getSessions: () => api.get('/security/sessions'),
  terminateSession: (sessionId) => api.delete(`/security/sessions/${sessionId}`),
  getSecuritySettings: () => api.get('/security/settings'),
  updateSecuritySettings: (data) => api.put('/security/settings', data),
  getBackupStatus: () => api.get('/security/backup/status'),
  triggerBackup: () => api.post('/security/backup/trigger'),
};

// STATISTIQUES
export const statsAPI = {
  admin: () => api.get('/stats/admin'),
  user: () => api.get('/stats/user'),
  exportExcel: () => api.get('/stats/export/excel', { responseType: 'blob' }),
  exportPDF: () => api.get('/stats/export/pdf', { responseType: 'blob' }),
};

// FOURNISSEURS DE PAIEMENT
export const providersAPI = {
  active: () => api.get('/payment-providers/active'),
  adminAll: () => api.get('/admin/payment-providers'),
  adminById: (id) => api.get(`/admin/payment-providers/${id}`),
  create: (data) => api.post('/admin/payment-providers', data),
  update: (id, data) => api.put(`/admin/payment-providers/${id}`, data),
  delete: (id) => api.delete(`/admin/payment-providers/${id}`),
};

// CATÉGORIES
export const categoriesAPI = {
  all: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// TAGS
export const tagsAPI = {
  all: (params) => api.get('/tags', { params }),
  create: (data) => api.post('/tags', data),
  delete: (id) => api.delete(`/tags/${id}`),
};
*/

// ===============================
// INDICATEUR DE MODE
// ===============================

console.log('🎯 Mode API: MOCK (services mockés activés)');

// ===============================
// EXPORT DEFAULT (pour compatibilité)
// ===============================

// Pour les composants qui utilisent encore l'import par défaut
const api = {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  tags: tagsAPI,
  stats: statsAPI,
  orders: ordersAPI,
  payments: paymentsAPI,
  fedapay: fedapayAPI,
  freelance: freelanceAPI,
  withdrawals: withdrawalsAPI,
  admin: adminAPI,
  providers: providersAPI,
  files: filesAPI,
  notifications: notificationsAPI,
  chat: chatAPI,
  aiAssistant: aiAssistantAPI,
  security: securityAPI
};

export default api;