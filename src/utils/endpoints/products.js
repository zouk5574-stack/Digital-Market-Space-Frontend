export const PRODUCT_ENDPOINTS = {
  LIST: '/api/products',
  DETAIL: id => `/api/products/${id}`,
  CREATE: '/api/products',
  UPDATE: id => `/api/products/${id}`,
  DELETE: id => `/api/products/${id}`,
  SEARCH: '/api/products/search',
};