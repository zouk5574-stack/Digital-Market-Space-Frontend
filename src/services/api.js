// src/services/api.js
import axios from 'axios';
import {
  AUTH,
  ADMIN,
  FREELANCE,
  PRODUCTS,
  ORDERS,
  WITHDRAWALS,
  FILES,
  FEDAPAY,
  PAYMENTS,
  SETTINGS,
  CATEGORIES,
  TAGS,
  NOTIFS,
  CHAT,
  AI,
  AI_EXTRA,
  STATS,
  PROVIDERS
} from './endpoints';

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
  login: (credentials) => api.post(AUTH.LOGIN, credentials),
  superAdminLogin: (data) => api.post(AUTH.SUPER_ADMIN_LOGIN, data),
  register: (userData) => api.post(AUTH.REGISTER, userData),
  logout: () => api.post(AUTH.LOGOUT),
  getProfile: () => api.get(AUTH.PROFILE),
};

// ===============================
// ADMINISTRATION
// ===============================
export const adminAPI = {
  users: {
    list: (params) => api.get(ADMIN.USERS, { params }),
    toggleStatus: (userId, is_active) => api.patch(ADMIN.USER_STATUS(userId), { is_active }),
  },
  withdrawals: {
    list: () => api.get(ADMIN.WITHDRAWALS),
    approve: (id) => api.patch(ADMIN.WITHDRAW_APPROVE(id)),
    reject: (id, reason) => api.patch(ADMIN.WITHDRAW_REJECT(id), { reason }),
  },
  stats: {
    dashboard: () => api.get(ADMIN.STATS_DASHBOARD),
    exportExcel: () => api.get(ADMIN.STATS_EXPORT_EXCEL, { responseType: 'blob' }),
    exportPDF: () => api.get(ADMIN.STATS_EXPORT_PDF, { responseType: 'blob' }),
  },
  commission: {
    update: (settings) => api.put(ADMIN.COMMISSION_SETTINGS, settings),
  },
  settings: {
    get: () => api.get(ADMIN.SETTINGS),
    update: (data) => api.put(ADMIN.SETTINGS, data),
  },
  logs: {
    get: () => api.get(ADMIN.LOGS),
    getByAction: (action) => api.get(ADMIN.LOGS_BY_ACTION(action)),
  },
};

// ===============================
// FREELANCE / MISSIONS
// ===============================
export const freelanceAPI = {
  missions: {
    list: (params) => api.get(FREELANCE.MISSIONS, { params }),
    getById: (id) => api.get(FREELANCE.MISSION_BY_ID(id)),
    create: (data) => api.post(FREELANCE.MISSIONS, data),
    apply: (data) => api.post(FREELANCE.APPLY, data),
    acceptApplication: (applicationId) =>
      api.post(FREELANCE.ACCEPT_APPLICATION, { application_id: applicationId }),
    deliver: (data) => api.post(FREELANCE.DELIVER, data),
    validateDelivery: (deliveryId) =>
      api.post(FREELANCE.VALIDATE_DELIVERY, { delivery_id: deliveryId }),
  },
  applications: {
    my: () => api.get(FREELANCE.MY_APPLICATIONS),
    byMission: (missionId) => api.get(FREELANCE.APPLICATIONS_BY_MISSION(missionId)),
  },
};

// ===============================
// PRODUITS (AVEC MÉTHODES AJOUTÉES)
// ===============================
export const productsAPI = {
  all: (params) => api.get(PRODUCTS.BASE, { params }),
  getById: (id) => api.get(PRODUCTS.BY_ID(id)),
  my: () => api.get(PRODUCTS.MY),
  search: (query, params) =>
    api.get(PRODUCTS.SEARCH, { params: { q: query, ...params } }),
  // ✅ MÉTHODES AJOUTÉES
  create: (data) => api.post(PRODUCTS.BASE, data),
  update: (id, data) => api.put(PRODUCTS.BY_ID(id), data),
  delete: (id) => api.delete(PRODUCTS.BY_ID(id)),
};

// ===============================
// COMMANDES
// ===============================
export const ordersAPI = {
  all: () => api.get(ORDERS.BASE),
  my: () => api.get(ORDERS.MY),
  sales: () => api.get(ORDERS.SALES),
  updateStatus: (id, status) => api.patch(ORDERS.UPDATE_STATUS(id), { status }),
};

// ===============================
// RETRAITS / WALLET (AVEC MÉTHODES AJOUTÉES)
// ===============================
export const withdrawalsAPI = {
  all: () => api.get(WITHDRAWALS.BASE),
  my: () => api.get(WITHDRAWALS.MY),
  adminAll: () => api.get(WITHDRAWALS.ADMIN_ALL),
  // ✅ MÉTHODES AJOUTÉES
  create: (data) => api.post(WITHDRAWALS.BASE, data),
  cancel: (id) => api.delete(`${WITHDRAWALS.BASE}/${id}`),
};

// ===============================
// FICHIERS (SUPABASE / STORAGE)
// ===============================
export const filesAPI = {
  upload: (formData) =>
    api.post(FILES.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  signedUrl: (id) => api.get(FILES.SIGNED_URL(id)),
  publicUrl: (id) => api.get(FILES.PUBLIC_URL(id)),
  delete: (id) => api.delete(FILES.DELETE(id)),
};

// ===============================
// PAIEMENT FEDAPAY
// ===============================
export const fedapayAPI = {
  adminKeys: () => api.get(FEDAPAY.ADMIN_KEYS),
  setKeys: (data) => api.post(FEDAPAY.ADMIN_KEYS, data),
  initPayment: (data) => api.post(FEDAPAY.INIT_PAYMENT, data),
  initEscrow: (data) => api.post(FEDAPAY.INIT_ESCROW, data),
};

// ===============================
// TRANSACTIONS / PAYMENTS
// ===============================
export const paymentsAPI = {
  transactions: () => api.get(PAYMENTS.TRANSACTIONS),
  getById: (id) => api.get(PAYMENTS.BY_ID(id)),
  init: (data) => api.post(PAYMENTS.INIT, data),
  verify: (data) => api.post(PAYMENTS.VERIFY, data),
};

// ===============================
// NOTIFICATIONS
// ===============================
export const notificationsAPI = {
  my: () => api.get(NOTIFS.MY),
  markRead: (id) => api.patch(NOTIFS.MARK_READ(id)),
  markAllRead: () => api.patch(NOTIFS.MARK_ALL_READ),
  delete: (id) => api.delete(NOTIFS.DELETE(id)),
  adminBulk: (data) => api.post(NOTIFS.ADMIN_BULK, data),
  adminHistory: () => api.get(NOTIFS.ADMIN_HISTORY),
  adminDelete: (id) => api.delete(NOTIFS.ADMIN_DELETE(id)),
  userStats: () => api.get(NOTIFS.USER_STATS),
};

// ===============================
// CHAT / MESSAGERIE
// ===============================
export const chatAPI = {
  conversations: () => api.get(CHAT.CONVERSATIONS),
  messages: (convId) => api.get(CHAT.MESSAGES(convId)),
  sendMessage: (data) => api.post(CHAT.SEND_MESSAGE, data),
};

// ===============================
// IA ASSISTANT
// ===============================
export const aiAPI = {
  sendMessage: (data) => api.post(AI.MESSAGE, data),
  generate: (data) => api.post(AI.GENERATE, data),
  conversations: {
    list: (params) => api.get(AI.CONVERSATIONS, { params }),
    delete: (id) => api.delete(AI.CONVERSATION_DELETE(id)),
  },
};

// ===============================
// IA EXTRA
// ===============================
export const aiExtraAPI = {
  toolsList: () => api.get(AI_EXTRA.TOOLS_LIST),
  savePrompt: (data) => api.post(AI_EXTRA.SAVE_PROMPT, data),
};

// ===============================
// STATISTIQUES
// ===============================
export const statsAPI = {
  admin: () => api.get(STATS.ADMIN),
  user: () => api.get(STATS.USER),
  exportExcel: () => api.get(STATS.EXPORT_EXCEL, { responseType: 'blob' }),
  exportPDF: () => api.get(STATS.EXPORT_PDF, { responseType: 'blob' }),
};

// ===============================
// FOURNISSEURS DE PAIEMENT
// ===============================
export const providersAPI = {
  active: () => api.get(PROVIDERS.ACTIVE),
  adminAll: () => api.get(PROVIDERS.ADMIN_ALL),
  adminById: (id) => api.get(PROVIDERS.ADMIN_BY_ID(id)),
  create: (data) => api.post(PROVIDERS.ADMIN_ALL, data),
  update: (id, data) => api.put(PROVIDERS.ADMIN_BY_ID(id), data),
  delete: (id) => api.delete(PROVIDERS.ADMIN_BY_ID(id)),
};

// ===============================
// EXPORT DEFAULT
// ===============================
export default api;
