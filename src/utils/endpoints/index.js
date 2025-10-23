import { ADMIN_ENDPOINTS } from './admin';
import { AI_ENDPOINTS } from './ai';
import { AUTH_ENDPOINTS } from './auth';
import { FEDAPAY_ENDPOINTS } from './fedapay';
import { FREELANCE_ENDPOINTS } from './freelance';
import { FILES_ENDPOINTS } from './files';
import { NOTIFICATION_ENDPOINTS } from './notifications';
import { ORDER_ENDPOINTS } from './orders';
import { PRODUCT_ENDPOINTS } from './products';
import { TRANSACTION_ENDPOINTS } from './transactions';
import { USER_ENDPOINTS } from './users';
import { WITHDRAWAL_ENDPOINTS } from './withdrawals';
import { LOG_ENDPOINTS } from './logs';

export const API_ENDPOINTS = {
  ADMIN: ADMIN_ENDPOINTS,
  AI: AI_ENDPOINTS,
  AUTH: AUTH_ENDPOINTS,
  FEDAPAY: FEDAPAY_ENDPOINTS,
  FREELANCE: FREELANCE_ENDPOINTS,
  FILES: FILES_ENDPOINTS,
  NOTIFICATIONS: NOTIFICATION_ENDPOINTS,
  ORDERS: ORDER_ENDPOINTS,
  PRODUCTS: PRODUCT_ENDPOINTS,
  TRANSACTIONS: TRANSACTION_ENDPOINTS,
  USERS: USER_ENDPOINTS,
  WITHDRAWALS: WITHDRAWAL_ENDPOINTS,
  LOGS: LOG_ENDPOINTS,
};