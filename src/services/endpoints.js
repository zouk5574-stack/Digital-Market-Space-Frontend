// ===============================
// AUTHENTIFICATION
// ===============================
export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  SUPER_ADMIN_LOGIN: '/auth/super-admin/login',
};

// ===============================
// ADMINISTRATION
// ===============================
export const ADMIN = {
  USERS: '/admin/users',
  USER_STATUS: (userId) => `/admin/users/${userId}/status`,

  WITHDRAWALS: '/admin/withdrawals',
  WITHDRAW_APPROVE: (id) => `/admin/withdrawals/${id}/approve`,
  WITHDRAW_REJECT: (id) => `/admin/withdrawals/${id}/reject`,

  STATS_DASHBOARD: '/admin/stats/dashboard',
  STATS_EXPORT_EXCEL: '/admin/stats/export/excel',
  STATS_EXPORT_PDF: '/admin/stats/export/pdf',

  COMMISSION_SETTINGS: '/admin/commission/settings',
  LOGS: '/admin/logs',
  LOGS_BY_ACTION: (action) => `/admin/logs/action/${action}`,

  SETTINGS: '/admin/settings', // ✅ ajouté pour PlatformSettingsModal
};

// ===============================
// FREELANCE / MISSIONS
// ===============================
export const FREELANCE = {
  MISSIONS: '/freelance/missions',
  MISSION_BY_ID: (id) => `/freelance/missions/${id}`,
  APPLY: '/freelance/missions/apply',
  ACCEPT_APPLICATION: '/freelance/missions/accept-application',
  DELIVER: '/freelance/missions/deliver',
  VALIDATE_DELIVERY: '/freelance/missions/validate-delivery',
  MY_APPLICATIONS: '/freelance/applications/my',
  APPLICATIONS_BY_MISSION: (missionId) => `/freelance/applications/mission/${missionId}`,
};

// ===============================
// PRODUITS
// ===============================
export const PRODUCTS = {
  BASE: '/products',
  BY_ID: (id) => `/products/${id}`,
  MY: '/products/my',
  SEARCH: '/products/search',
};

// ===============================
// COMMANDES
// ===============================
export const ORDERS = {
  BASE: '/orders',
  MY: '/orders/my',
  SALES: '/orders/sales',
  UPDATE_STATUS: (id) => `/orders/${id}/status`,
};

// ===============================
// RETRAITS / WALLET
// ===============================
export const WITHDRAWALS = {
  BASE: '/withdrawals',
  MY: '/withdrawals/my',
  ADMIN_ALL: '/admin/withdrawals/all',
};

// ===============================
// FICHIERS
// ===============================
export const FILES = {
  UPLOAD: '/files/upload',
  SIGNED_URL: (id) => `/files/${id}/signed-url`,
  PUBLIC_URL: (id) => `/files/${id}/public-url`,
  DELETE: (id) => `/files/${id}`,
};

// ===============================
// PAIEMENT FEDAPAY
// ===============================
export const FEDAPAY = {
  ADMIN_KEYS: '/admin/fedapay/keys',
  INIT_PAYMENT: '/fedapay/init-payment',
  INIT_ESCROW: '/fedapay/init-escrow',
};

// ===============================
// TRANSACTIONS / PAYMENTS
// ===============================
export const PAYMENTS = {
  TRANSACTIONS: '/transactions',
  BY_ID: (id) => `/transactions/${id}`,
  INIT: '/transactions/init',
  VERIFY: '/transactions/verify',
};

// ===============================
// PARAMÈTRES / SÉCURITÉ
// ===============================
export const SETTINGS = {
  SECURITY: '/settings/security',
  SYSTEM: '/settings/system',
  BACKUP: '/settings/backup',
};

// ===============================
// CATÉGORIES & TAGS
// ===============================
export const CATEGORIES = {
  BASE: '/categories',
  BY_ID: (id) => `/categories/${id}`,
};
export const TAGS = {
  BASE: '/tags',
};

// ===============================
// NOTIFICATIONS
// ===============================
export const NOTIFS = {
  MY: '/notifications',
  MARK_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
  DELETE: (id) => `/notifications/${id}`,
  ADMIN_BULK: '/admin/notifications/bulk',
  ADMIN_HISTORY: '/admin/notifications/history',
  ADMIN_DELETE: (id) => `/admin/notifications/${id}`,
  USER_STATS: '/admin/notifications/user-stats',
};

// ===============================
// CHAT / MESSAGERIE
// ===============================
export const CHAT = {
  CONVERSATIONS: '/chat/conversations',
  MESSAGES: (convId) => `/chat/conversations/${convId}/messages`,
  SEND_MESSAGE: '/chat/message/send',
};

// ===============================
// IA ASSISTANT
// ===============================
export const AI = {
  MESSAGE: '/ai/assistant/message',
  GENERATE: '/ai/assistant/generate',
  CONVERSATIONS: '/ai/assistant/conversations',
  CONVERSATION_DELETE: (id) => `/ai/assistant/conversations/${id}`,
};

// Extensions IA
export const AI_EXTRA = {
  TOOLS_LIST: '/ai/assistant/tools',
  SAVE_PROMPT: '/ai/assistant/prompt/save',
};

// ===============================
// STATISTIQUES
// ===============================
export const STATS = {
  ADMIN: '/stats/admin',
  USER: '/stats/user',
  EXPORT_EXCEL: '/stats/export/excel',
  EXPORT_PDF: '/stats/export/pdf',
};

// ===============================
// FOURNISSEURS DE PAIEMENT
// ===============================
export const PROVIDERS = {
  ACTIVE: '/payment-providers/active',
  ADMIN_ALL: '/admin/payment-providers',
  ADMIN_BY_ID: (id) => `/admin/payment-providers/${id}`,
};