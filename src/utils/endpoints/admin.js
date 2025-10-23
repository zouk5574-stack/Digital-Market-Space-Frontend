export const ADMIN_ENDPOINTS = {
  USERS: '/api/admin/users',
  USER_STATUS: userId => `/api/admin/users/${userId}/status`,
  WITHDRAWALS: '/api/admin/withdrawals',
  VALIDATE_WITHDRAWAL: id => `/api/admin/withdrawals/${id}/validate`,
  REJECT_WITHDRAWAL: id => `/api/admin/withdrawals/${id}/reject`,
  STATS: '/api/admin/stats',
  COMMISSION: '/api/admin/settings/commission',
  NOTIFICATIONS: {
    SEND_BULK: '/api/admin/notifications/send-bulk',
    HISTORY: '/api/admin/notifications/history',
    DELETE: id => `/api/admin/notifications/${id}`,
  },
  USER_STATS: '/api/admin/users/stats',
};