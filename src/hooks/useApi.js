// src/hooks/useApi.js - VERSION FINALE UNIFIÉE
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les appels API avec états de loading, error et data
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

// Authentification
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

// Wallet et Retraits
export const useWalletApi = () => {
  const { execute: getBalance, ...balanceState } = useApi(
    useCallback(() => walletAPI.getBalance(), [])
  );

  const { execute: getTransactions, ...transactionsState } = useApi(
    useCallback(() => walletAPI.getTransactions(), [])
  );

  const { execute: createWithdrawal, ...createState } = useApi(
    useCallback((withdrawalData) => walletAPI.withdrawals.create(withdrawalData), [])
  );

  const { execute: getMyWithdrawals, ...myWithdrawalsState } = useApi(
    useCallback(() => walletAPI.withdrawals.getMyWithdrawals(), [])
  );

  return {
    actions: {
      getBalance,
      getTransactions,
      createWithdrawal,
      getMyWithdrawals,
    },
    states: {
      balance: balanceState,
      transactions: transactionsState,
      create: createState,
      myWithdrawals: myWithdrawalsState,
    },
  };
};

// Administration
export const useAdminApi = () => {
  const { execute: listUsers, ...usersState } = useApi(
    useCallback(() => adminAPI.users.list(), [])
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

  const { execute: getLogs, ...logsState } = useApi(
    useCallback(() => adminAPI.logs.get(), [])
  );

  return {
    actions: {
      listUsers,
      toggleUserStatus,
      listWithdrawals,
      approveWithdrawal,
      rejectWithdrawal,
      getDashboardStats,
      getLogs,
    },
    states: {
      users: usersState,
      toggleStatus: toggleStatusState,
      withdrawals: withdrawalsState,
      approve: approveState,
      reject: rejectState,
      stats: statsState,
      logs: logsState,
    },
  };
};

// Fichiers
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

// Missions Freelance
export const useFreelanceApi = () => {
  const { execute: createMission, ...createMissionState } = useApi(
    useCallback((missionData) => freelanceAPI.missions.create(missionData), [])
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
      applyToMission,
      acceptApplication,
      deliverWork,
      validateDelivery,
    },
    states: {
      createMission: createMissionState,
      apply: applyState,
      accept: acceptState,
      deliver: deliverState,
      validate: validateState,
    },
  };
};

// Notifications
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

  return {
    actions: {
      getMyNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    },
    states: {
      notifications: notificationsState,
      markRead: markReadState,
      markAllRead: markAllReadState,
      delete: deleteState,
    },
  };
};

// Statistiques
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

// Providers de Paiement
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
