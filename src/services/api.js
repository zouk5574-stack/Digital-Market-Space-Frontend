// src/services/api.js - VERSION FINALE UNIFIÉE ET COMPLÈTE
import axios from 'axios';

// Configuration de base
const API_BASE_URL = import.meta.env_VITE_API_URL || 'http://localhost:3001/api';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs globales
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('Erreur de validation:', data.error);
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
          console.error('Accès refusé:', data.error);
          break;
        case 404:
          console.error('Ressource non trouvable:', data.error);
          break;
        case 409:
          console.error('Conflit:', data.error);
          break;
        case 500:
          console.error('Erreur serveur:', data.error);
          break;
        default:
          console.error('Erreur inconnue:', data.error);
      }
    }
    return Promise.reject(error);
  }
);

// ===============================
// SERVICES AUTHENTIFICATION
// ===============================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', {
    identifier: credentials.identifier,
    password: credentials.password
  }),
  
  superAdminLogin: (adminCredentials) => api.post('/auth/super-admin/login', {
    firstname: adminCredentials.firstname,
    lastname: adminCredentials.lastname,
    phone: adminCredentials.phone,
    password: adminCredentials.password
  }),
  
  register: (userData) => api.post('/auth/register', {
    username: userData.username,
    firstname: userData.firstname,
    lastname: userData.lastname,
    phone: userData.phone,
    email: userData.email,
    password: userData.password,
    role: userData.role
  }),
  
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile')
};

// ===============================
// SERVICES ADMINISTRATION
// ===============================
export const adminAPI = {
  users: {
    list: (params = {}) => api.get('/admin/users', { params }),
    toggleStatus: (userId, is_active) => api.patch(`/admin/users/${userId}/status`, { is_active })
  },
  
  withdrawals: {
    list: () => api.get('/admin/withdrawals'),
    approve: (withdrawalId) => api.patch(`/admin/withdrawals/${withdrawalId}/approve`),
    reject: (withdrawalId, rejection_reason) => api.patch(`/admin/withdrawals/${withdrawalId}/reject`, { rejection_reason })
  },
  
  stats: {
    getDashboard: () => api.get('/admin/stats/dashboard'),
    exportExcel: () => api.get('/admin/stats/export/excel', { responseType: 'blob' }),
    exportPDF: () => api.get('/admin/stats/export/pdf', { responseType: 'blob' })
  },
  
  commission: {
    updateSettings: (settings) => api.put('/admin/commission/settings', settings)
  },
  
  logs: {
    get: () => api.get('/admin/logs'),
    getByAction: (actionFilter) => api.get(`/admin/logs/action/${actionFilter}`)
  }
};

// ===============================
// SERVICES WALLET & RETRAITS
// ===============================
export const walletAPI = {
  getBalance: () => api.get('/wallet'),
  getTransactions: () => api.get('/wallet/transactions'),
  
  withdrawals: {
    create: (withdrawalData) => api.post('/withdrawals', {
      amount: withdrawalData.amount,
      provider_id: withdrawalData.provider_id,
      account_number: withdrawalData.account_number
    }),
    getMyWithdrawals: () => api.get('/withdrawals/my'),
    getAll: () => api.get('/admin/withdrawals/all'),
    approve: (withdrawalId) => api.patch(`/admin/withdrawals/${withdrawalId}/approve`),
    reject: (withdrawalId, reason) => api.patch(`/admin/withdrawals/${withdrawalId}/reject`, { reason })
  }
};

// ===============================
// SERVICES PAIEMENT FEDAPAY
// ===============================
export const fedapayAPI = {
  setKeys: (keys) => api.post('/admin/fedapay/keys', keys),
  getKeys: () => api.get('/admin/fedapay/keys'),
  
  initProductPayment: (paymentData) => api.post('/fedapay/init-payment', {
    amount: paymentData.amount,
    description: paymentData.description,
    orderId: paymentData.orderId,
    buyerId: paymentData.buyerId
  }),
  
  initMissionEscrow: (escrowData) => api.post('/fedapay/init-escrow', {
    amount: escrowData.amount,
    missionId: escrowData.missionId,
    buyerId: escrowData.buyerId
  })
};

// ===============================
// SERVICES FICHIERS
// ===============================
export const filesAPI = {
  upload: (formData) => api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  getSignedUrl: (fileId) => api.get(`/files/${fileId}/signed-url`),
  getPublicUrl: (fileId) => api.get(`/files/${fileId}/public-url`),
  delete: (fileId) => api.delete(`/files/${fileId}`)
};

// ===============================
// SERVICES FREELANCE/MISSIONS
// ===============================
export const freelanceAPI = {
  missions: {
    create: (missionData) => api.post('/freelance/missions', missionData),
    list: (params = {}) => api.get('/freelance/missions', { params }),
    getById: (id) => api.get(`/freelance/missions/${id}`),
    apply: (applicationData) => api.post('/freelance/missions/apply', applicationData),
    acceptApplication: (applicationId) => api.post('/freelance/missions/accept-application', { application_id: applicationId }),
    deliverWork: (deliveryData) => api.post('/freelance/missions/deliver', deliveryData),
    validateDelivery: (deliveryId) => api.post('/freelance/missions/validate-delivery', { delivery_id: deliveryId })
  },
  
  applications: {
    getMyApplications: () => api.get('/freelance/applications/my'),
    getByMission: (missionId) => api.get(`/freelance/applications/mission/${missionId}`)
  }
};

// ===============================
// SERVICES COMMANDES
// ===============================
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my'),
  getMySales: () => api.get('/orders/sales'),
  updateStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status })
};

// ===============================
// SERVICES NOTIFICATIONS
// ===============================
export const notificationsAPI = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),
  
  sendBulk: (notificationData) => api.post('/admin/notifications/bulk', notificationData),
  getHistory: () => api.get('/admin/notifications/history'),
  deleteAdmin: (notificationId) => api.delete(`/admin/notifications/${notificationId}`),
  getUserStats: () => api.get('/admin/notifications/user-stats')
};

// ===============================
// SERVICES IA ASSISTANT
// ===============================
export const aiAssistantAPI = {
  sendMessage: (messageData) => api.post('/ai/assistant/message', {
    message: messageData.message,
    context: messageData.context
  }),
  
  generateContent: (contentData) => api.post('/ai/assistant/generate', {
    type: contentData.type,
    parameters: contentData.parameters
  }),
  
  conversations: {
    list: (params = {}) => api.get('/ai/assistant/conversations', { params }),
    delete: (conversationId) => api.delete(`/ai/assistant/conversations/${conversationId}`)
  }
};

// ===============================
// SERVICES PRODUITS
// ===============================
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/my'),
  search: (query, params = {}) => api.get('/products/search', { params: { q: query, ...params } })
};

// ===============================
// SERVICES STATISTIQUES
// ===============================
export const statsAPI = {
  getAdminStats: () => api.get('/stats/admin'),
  getUserStats: () => api.get('/stats/user'),
  exportExcel: () => api.get('/stats/export/excel', { responseType: 'blob' }),
  exportPDF: () => api.get('/stats/export/pdf', { responseType: 'blob' })
};

// ===============================
// SERVICES PROVIDERS DE PAIEMENT
// ===============================
export const paymentProvidersAPI = {
  getActive: () => api.get('/payment-providers/active'),
  
  getAll: () => api.get('/admin/payment-providers'),
  create: (providerData) => api.post('/admin/payment-providers', providerData),
  update: (id, providerData) => api.put(`/admin/payment-providers/${id}`, providerData),
  delete: (id) => api.delete(`/admin/payment-providers/${id}`)
};

export default api;
