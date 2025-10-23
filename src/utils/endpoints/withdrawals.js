export const WITHDRAWAL_ENDPOINTS = {
  LIST: '/api/withdrawals',
  DETAIL: id => `/api/withdrawals/${id}`,
  CREATE: '/api/withdrawals',
  UPDATE_STATUS: id => `/api/withdrawals/${id}/status`,
};