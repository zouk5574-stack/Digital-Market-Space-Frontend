// src/hooks/useApi.js - VERSION COMPLÈTE ET UNIFIÉE
import { useState, useEffect, useCallback } from 'react';
import { 
  authAPI, 
  adminAPI, 
  walletAPI, 
  fedapayAPI, 
  filesAPI, 
  freelanceAPI, 
  ordersAPI, 
  notificationsAPI, 
  aiAssistantAPI, 
  productsAPI, 
  statsAPI, 
  paymentProvidersAPI 
} from '../services/api';

/**
 * Hook personnalisé principal pour gérer les appels API avec états de loading, error et data
 */
const useApi = (apiCall, initialData = null, immediate = false) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [executed, setExecuted] = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(...args);
      
      // Extraction intelligente des données selon la structure du backend
      const responseData = response.data.user || response.data.wallet || 
                          response.data.withdrawals || response.data.transactions || 
                          response.data.conversations || response.data.stats || 
                          response.data.notifications || response.data.orders ||
                          response.data.missions || response.data.applications ||
                          response.data.products || response.data.logs ||
                          response.data.providers || response.data.file || 
                          response.data.url || response.data.message ||
                          response.data.fedapay || response.data.checkout_url ||
                          response.data;
      
      setData(responseData);
      setExecuted(true);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.details || 
                          err.message || 
                          'Une erreur est survenue';
      
      setError(errorMessage);
      setExecuted(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    setExecuted(false);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    executed,
    execute,
    reset,
    setData,
  };
};

// ===============================
// HOOKS SPÉCIALISÉS PAR DOMAINE
// ===============================

// 🔐 AUTHENTIFICATION
export const useAuthApi = () => {
  const { execute: login, ...loginState } = useApi(
    useCallback((credentials) => authAPI.login(credentials), [])
  );

  const { execute: superAdminLogin, ...superAdminLoginState } = useApi(
    useCallback((credentials) => authAPI.superAdminLogin(credentials), [])
  );

  const { execute: register, ...registerState } = useApi(
    useCallback((userData) => authAPI.register(userData), [])
  );

  const { execute: logout, ...logoutState } = useApi(
    useCallback(() => authAPI.logout(), [])
  );

  const { execute: getProfile, ...profileState } = useApi(
    useCallback(() => authAPI.getProfile(), [])
  );

  return {
    actions: {
      login,
      superAdminLogin,
      register,
      logout,
      getProfile,
    },
    states: {
      login: loginState,
      superAdminLogin: superAdminLoginState,
      register: registerState,
      logout: logoutState,
      profile: profileState,
    },
  };
};

// 👑 ADMINISTRATION
export const useAdminApi = () => {
  const { execute: listUsers, ...usersState } = useApi(
    useCallback((params = {}) => adminAPI.users.list(params), [])
  );

  const { execute: toggleUserStatus, ...toggleStatusState } = useApi(
    useCallback((userId, is_active) => adminAPI.users.toggleStatus(userId, is_active), [])
  );

  const { execute: listWithdrawals, ...withdrawalsState } = useApi(
    useCallback(() => adminAPI.withdrawals.list(), [])
  );

  const { execute: approveWithdrawal, ...approveState } = useApi(
    useCallback((withdrawalId) => adminAPI.withdrawals.approve(withdrawalId), [])
  );

  const { execute: rejectWithdrawal, ...rejectState } = useApi(
    useCallback((withdrawalId, rejection_reason) => adminAPI.withdrawals.reject(withdrawalId, rejection_reason), [])
  );

  const { execute: getDashboardStats, ...statsState } = useApi(
    useCallback(() => adminAPI.stats.getDashboard(), [])
  );

  const { execute: updateCommissionSettings, ...commissionState } = useApi(
    useCallback((settings) => adminAPI.commission.updateSettings(settings), [])
  );

  const { execute: getLogs, ...logsState } = useApi(
    useCallback(() => adminAPI.logs.get(), [])
  );

  const { execute: getLogsByAction, ...logsByActionState } = useApi(
    useCallback((actionFilter) => adminAPI.logs.getByAction(actionFilter), [])
  );

  return {
    actions: {
      listUsers,
      toggleUserStatus,
      listWithdrawals,
      approveWithdrawal,
      rejectWithdrawal,
      getDashboardStats,
      updateCommissionSettings,
      getLogs,
      getLogsByAction,
    },
    states: {
      users: usersState,
      toggleStatus: toggleStatusState,
      withdrawals: withdrawalsState,
      approve: approveState,
      reject: rejectState,
      stats: statsState,
      commission: commissionState,
      logs: logsState,
      logsByAction: logsByActionState,
    },
  };
};

// 💰 WALLET & RETRAITS
export const useWalletApi = () => {
  const { execute: getBalance, ...balanceState } = useApi(
    useCallback(() => walletAPI.getBalance(), [])
  );

  const { execute: getTransactions, ...transactionsState } = useApi(
    useCallback(() => walletAPI.getTransactions(), [])
  );

  return {
    actions: {
      getBalance,
      getTransactions,
    },
    states: {
      balance: balanceState,
      transactions: transactionsState,
    },
  };
};

// 🏦 RETRAITS (Spécialisé)
export const useWithdrawalsApi = () => {
  const { execute: createWithdrawal, ...createState } = useApi(
    useCallback((withdrawalData) => walletAPI.withdrawals.create(withdrawalData), [])
  );

  const { execute: getMyWithdrawals, ...myWithdrawalsState } = useApi(
    useCallback(() => walletAPI.withdrawals.getMyWithdrawals(), [])
  );

  const { execute: getAllWithdrawals, ...allWithdrawalsState } = useApi(
    useCallback(() => walletAPI.withdrawals.getAll(), [])
  );

  const { execute: approveWithdrawal, ...approveState } = useApi(
    useCallback((withdrawalId) => walletAPI.withdrawals.approve(withdrawalId), [])
  );

  const { execute: rejectWithdrawal, ...rejectState } = useApi(
    useCallback((withdrawalId, reason) => walletAPI.withdrawals.reject(withdrawalId, reason), [])
  );

  return {
    actions: {
      createWithdrawal,
      getMyWithdrawals,
      getAllWithdrawals,
      approveWithdrawal,
      rejectWithdrawal,
    },
    states: {
      create: createState,
      myWithdrawals: myWithdrawalsState,
      allWithdrawals: allWithdrawalsState,
      approve: approveState,
      reject: rejectState,
    },
  };
};

// 💳 FEDAPAY - PAIEMENTS & ESCROW
export const useFedapayApi = () => {
  const { execute: setKeys, ...setKeysState } = useApi(
    useCallback((keys) => fedapayAPI.setKeys(keys), [])
  );

  const { execute: getKeys, ...getKeysState } = useApi(
    useCallback(() => fedapayAPI.getKeys(), [])
  );

  const { execute: initProductPayment, ...productPaymentState } = useApi(
    useCallback((paymentData) => fedapayAPI.initProductPayment(paymentData), [])
  );

  const { execute: initMissionEscrow, ...missionEscrowState } = useApi(
    useCallback((escrowData) => fedapayAPI.initMissionEscrow(escrowData), [])
  );

  return {
    actions: {
      setKeys,
      getKeys,
      initProductPayment,
      initMissionEscrow,
    },
    states: {
      setKeys: setKeysState,
      getKeys: getKeysState,
      productPayment: productPaymentState,
      missionEscrow: missionEscrowState,
    },
  };
};

// 📁 FICHIERS
export const useFilesApi = () => {
  const { execute: uploadFile, ...uploadState } = useApi(
    useCallback((formData) => filesAPI.upload(formData), [])
  );

  const { execute: getSignedUrl, ...signedUrlState } = useApi(
    useCallback((fileId) => filesAPI.getSignedUrl(fileId), [])
  );

  const { execute: getPublicUrl, ...publicUrlState } = useApi(
    useCallback((fileId) => filesAPI.getPublicUrl(fileId), [])
  );

  const { execute: deleteFile, ...deleteState } = useApi(
    useCallback((fileId) => filesAPI.delete(fileId), [])
  );

  return {
    actions: {
      uploadFile,
      getSignedUrl,
      getPublicUrl,
      deleteFile,
    },
    states: {
      upload: uploadState,
      signedUrl: signedUrlState,
      publicUrl: publicUrlState,
      delete: deleteState,
    },
  };
};

// 💼 MISSIONS FREELANCE & ESCROW
export const useFreelanceApi = () => {
  const { execute: createMission, ...createMissionState } = useApi(
    useCallback((missionData) => freelanceAPI.missions.create(missionData), [])
  );

  const { execute: listMissions, ...missionsState } = useApi(
    useCallback((params = {}) => freelanceAPI.missions.list(params), [])
  );

  const { execute: getMissionById, ...missionState } = useApi(
    useCallback((id) => freelanceAPI.missions.getById(id), [])
  );

  const { execute: getMyMissions, ...myMissionsState } = useApi(
    useCallback(() => freelanceAPI.missions.list(), [])
  );

  const { execute: getMyApplications, ...applicationsState } = useApi(
    useCallback(() => freelanceAPI.applications.getMyApplications(), [])
  );

  const { execute: getApplicationsByMission, ...applicationsByMissionState } = useApi(
    useCallback((missionId) => freelanceAPI.applications.getByMission(missionId), [])
  );

  const { execute: applyToMission, ...applyState } = useApi(
    useCallback((applicationData) => freelanceAPI.missions.apply(applicationData), [])
  );

  const { execute: acceptApplication, ...acceptState } = useApi(
    useCallback((applicationId) => freelanceAPI.missions.acceptApplication(applicationId), [])
  );

  const { execute: deliverWork, ...deliverState } = useApi(
    useCallback((deliveryData) => freelanceAPI.missions.deliverWork(deliveryData), [])
  );

  const { execute: validateDelivery, ...validateState } = useApi(
    useCallback((deliveryId) => freelanceAPI.missions.validateDelivery(deliveryId), [])
  );

  return {
    actions: {
      createMission,
      listMissions,
      getMissionById,
      getMyMissions,
      getMyApplications,
      getApplicationsByMission,
      applyToMission,
      acceptApplication,
      deliverWork,
      validateDelivery,
    },
    states: {
      createMission: createMissionState,
      missions: missionsState,
      mission: missionState,
      myMissions: myMissionsState,
      applications: applicationsState,
      applicationsByMission: applicationsByMissionState,
      apply: applyState,
      accept: acceptState,
      deliver: deliverState,
      validate: validateState,
    },
  };
};

// 🛒 COMMANDES
export const useOrdersApi = () => {
  const { execute: createOrder, ...createState } = useApi(
    useCallback((orderData) => ordersAPI.create(orderData), [])
  );

  const { execute: getMyOrders, ...ordersState } = useApi(
    useCallback(() => ordersAPI.getMyOrders(), [])
  );

  const { execute: getMySales, ...salesState } = useApi(
    useCallback(() => ordersAPI.getMySales(), [])
  );

  const { execute: updateOrderStatus, ...updateStatusState } = useApi(
    useCallback((orderId, status) => ordersAPI.updateStatus(orderId, status), [])
  );

  return {
    actions: {
      createOrder,
      getMyOrders,
      getMySales,
      updateOrderStatus,
    },
    states: {
      create: createState,
      orders: ordersState,
      sales: salesState,
      updateStatus: updateStatusState,
    },
  };
};

// 🔔 NOTIFICATIONS
export const useNotificationsApi = () => {
  const { execute: getMyNotifications, ...notificationsState } = useApi(
    useCallback(() => notificationsAPI.getMyNotifications(), [])
  );

  const { execute: markAsRead, ...markReadState } = useApi(
    useCallback((notificationId) => notificationsAPI.markAsRead(notificationId), [])
  );

  const { execute: markAllAsRead, ...markAllReadState } = useApi(
    useCallback(() => notificationsAPI.markAllAsRead(), [])
  );

  const { execute: deleteNotification, ...deleteState } = useApi(
    useCallback((notificationId) => notificationsAPI.delete(notificationId), [])
  );

  // Admin seulement
  const { execute: sendBulkNotification, ...bulkState } = useApi(
    useCallback((notificationData) => notificationsAPI.sendBulk(notificationData), [])
  );

  const { execute: getNotificationHistory, ...historyState } = useApi(
    useCallback(() => notificationsAPI.getHistory(), [])
  );

  const { execute: deleteAdminNotification, ...deleteAdminState } = useApi(
    useCallback((notificationId) => notificationsAPI.deleteAdmin(notificationId), [])
  );

  const { execute: getUserStats, ...userStatsState } = useApi(
    useCallback(() => notificationsAPI.getUserStats(), [])
  );

  return {
    actions: {
      getMyNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      sendBulkNotification,
      getNotificationHistory,
      deleteAdminNotification,
      getUserStats,
    },
    states: {
      notifications: notificationsState,
      markRead: markReadState,
      markAllRead: markAllReadState,
      delete: deleteState,
      bulk: bulkState,
      history: historyState,
      deleteAdmin: deleteAdminState,
      userStats: userStatsState,
    },
  };
};

// 🤖 ASSISTANT IA
export const useAIAssistantApi = () => {
  const { execute: sendMessage, ...messageState } = useApi(
    useCallback((messageData) => aiAssistantAPI.sendMessage(messageData), [])
  );

  const { execute: generateContent, ...contentState } = useApi(
    useCallback((contentData) => aiAssistantAPI.generateContent(contentData), [])
  );

  const { execute: listConversations, ...conversationsState } = useApi(
    useCallback((params = {}) => aiAssistantAPI.conversations.list(params), [])
  );

  const { execute: deleteConversation, ...deleteState } = useApi(
    useCallback((conversationId) => aiAssistantAPI.conversations.delete(conversationId), [])
  );

  return {
    actions: {
      sendMessage,
      generateContent,
      listConversations,
      deleteConversation,
    },
    states: {
      message: messageState,
      content: contentState,
      conversations: conversationsState,
      delete: deleteState,
    },
  };
};

// 📦 PRODUITS
export const useProductsApi = () => {
  const { execute: getAllProducts, ...productsState } = useApi(
    useCallback((params = {}) => productsAPI.getAll(params), [])
  );

  const { execute: getProductById, ...productState } = useApi(
    useCallback((id) => productsAPI.getById(id), [])
  );

  const { execute: createProduct, ...createState } = useApi(
    useCallback((productData) => productsAPI.create(productData), [])
  );

  const { execute: updateProduct, ...updateState } = useApi(
    useCallback((id, productData) => productsAPI.update(id, productData), [])
  );

  const { execute: deleteProduct, ...deleteState } = useApi(
    useCallback((id) => productsAPI.delete(id), [])
  );

  const { execute: getMyProducts, ...myProductsState } = useApi(
    useCallback(() => productsAPI.getMyProducts(), [])
  );

  const { execute: searchProducts, ...searchState } = useApi(
    useCallback((query, params = {}) => productsAPI.search(query, params), [])
  );

  return {
    actions: {
      getAllProducts,
      getProductById,
      createProduct,
      updateProduct,
      deleteProduct,
      getMyProducts,
      searchProducts,
    },
    states: {
      products: productsState,
      product: productState,
      create: createState,
      update: updateState,
      delete: deleteState,
      myProducts: myProductsState,
      search: searchState,
    },
  };
};

// 📊 STATISTIQUES
export const useStatsApi = () => {
  const { execute: getAdminStats, ...adminStatsState } = useApi(
    useCallback(() => statsAPI.getAdminStats(), [])
  );

  const { execute: getUserStats, ...userStatsState } = useApi(
    useCallback(() => statsAPI.getUserStats(), [])
  );

  const { execute: exportExcel, ...exportExcelState } = useApi(
    useCallback(() => statsAPI.exportExcel(), [])
  );

  const { execute: exportPDF, ...exportPDFState } = useApi(
    useCallback(() => statsAPI.exportPDF(), [])
  );

  return {
    actions: {
      getAdminStats,
      getUserStats,
      exportExcel,
      exportPDF,
    },
    states: {
      adminStats: adminStatsState,
      userStats: userStatsState,
      exportExcel: exportExcelState,
      exportPDF: exportPDFState,
    },
  };
};

// 🏪 PROVIDERS DE PAIEMENT
export const usePaymentProvidersApi = () => {
  const { execute: getActiveProvider, ...activeProviderState } = useApi(
    useCallback(() => paymentProvidersAPI.getActive(), [])
  );

  const { execute: getAllProviders, ...allProvidersState } = useApi(
    useCallback(() => paymentProvidersAPI.getAll(), [])
  );

  const { execute: createProvider, ...createProviderState } = useApi(
    useCallback((providerData) => paymentProvidersAPI.create(providerData), [])
  );

  const { execute: updateProvider, ...updateProviderState } = useApi(
    useCallback((id, providerData) => paymentProvidersAPI.update(id, providerData), [])
  );

  const { execute: deleteProvider, ...deleteProviderState } = useApi(
    useCallback((id) => paymentProvidersAPI.delete(id), [])
  );

  return {
    actions: {
      getActiveProvider,
      getAllProviders,
      createProvider,
      updateProvider,
      deleteProvider,
    },
    states: {
      activeProvider: activeProviderState,
      allProviders: allProvidersState,
      createProvider: createProviderState,
      updateProvider: updateProviderState,
      deleteProvider: deleteProviderState,
    },
  };
};

export default useApi;
