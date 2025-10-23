export const FEDAPAY_ENDPOINTS = {
  INITIATE: '/api/fedapay/initiate',
  TRANSACTION: id => `/api/fedapay/transaction/${id}`,
  WEBHOOK: '/api/fedapay/webhook',
};