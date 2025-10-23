export const ORDER_ENDPOINTS = {
  LIST: '/api/orders',
  DETAIL: id => `/api/orders/${id}`,
  CREATE: '/api/orders',
  UPDATE: id => `/api/orders/${id}`,
  DELETE: id => `/api/orders/${id}`,
};