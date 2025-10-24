// 🔐 AUTHENTIFICATION - CORRIGÉ
export const useAuthApi = () => {
  const { execute: login, ...loginState } = useApi(
    useCallback((credentials) => authAPI.login(credentials), []),
    null,
    false,
    (data) => data // ✅ Backend retourne directement {token, user}
  );

  const { execute: superAdminLogin, ...superAdminLoginState } = useApi(
    useCallback((credentials) => authAPI.superAdminLogin(credentials), []),
    null,
    false,
    (data) => data // ✅ Même structure
  );

  // ... autres méthodes auth
};

// 👑 ADMINISTRATION - CORRIGÉ
export const useAdminApi = () => {
  const { execute: listUsers, ...usersState } = useApi(
    useCallback((params = {}) => adminAPI.users.list(params), []),
    [],
    false,
    (data) => data.users || data
  );

  const { execute: toggleUserStatus, ...toggleStatusState } = useApi(
    useCallback((userId, is_active) => adminAPI.users.toggleStatus(userId, is_active), [])
  );

  const { execute: listWithdrawals, ...withdrawalsState } = useApi(
    useCallback(() => adminAPI.withdrawals.list(), []),
    [],
    false,
    (data) => data.withdrawals || data
  );

  const { execute: getDashboardStats, ...statsState } = useApi(
    useCallback(() => adminAPI.stats.dashboard(), []) // ✅ Correction: dashboard()
  );

  const { execute: updateCommissionSettings, ...commissionState } = useApi(
    useCallback((settings) => adminAPI.commission.update(settings), []) // ✅ Correction: update()
  );

  // ... autres méthodes admin
};

// 🏦 RETRAITS (Spécialisé) - CORRIGÉ
export const useWithdrawalsApi = () => {
  const { execute: createWithdrawal, ...createState } = useApi(
    useCallback((withdrawalData) => withdrawalsAPI.create(withdrawalData), [])
  );

  const { execute: getMyWithdrawals, ...myWithdrawalsState } = useApi(
    useCallback(() => withdrawalsAPI.my(), []) // ✅ Correction: my()
  );

  const { execute: getAllWithdrawals, ...allWithdrawalsState } = useApi(
    useCallback(() => withdrawalsAPI.all(), []) // ✅ Correction: all()
  );

  // ... autres méthodes withdrawals
};

// 💳 FEDAPAY - CORRIGÉ
export const useFedapayApi = () => {
  const { execute: setKeys, ...setKeysState } = useApi(
    useCallback((keys) => fedapayAPI.setKeys(keys), [])
  );

  const { execute: getKeys, ...getKeysState } = useApi(
    useCallback(() => fedapayAPI.adminKeys(), []) // ✅ Correction: adminKeys()
  );

  const { execute: initProductPayment, ...productPaymentState } = useApi(
    useCallback((paymentData) => fedapayAPI.initPayment(paymentData), [])
  );

  const { execute: initMissionEscrow, ...missionEscrowState } = useApi(
    useCallback((escrowData) => fedapayAPI.initEscrow(escrowData), [])
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

// 💼 MISSIONS FREELANCE - CORRIGÉ
export const useFreelanceApi = () => {
  const { execute: createMission, ...createMissionState } = useApi(
    useCallback((missionData) => freelanceAPI.missions.create(missionData), [])
  );

  const { execute: getMyApplications, ...applicationsState } = useApi(
    useCallback(() => freelanceAPI.applications.my(), []) // ✅ Correction: my()
  );

  const { execute: getApplicationsByMission, ...applicationsByMissionState } = useApi(
    useCallback((missionId) => freelanceAPI.applications.byMission(missionId), []) // ✅ Correction: byMission()
  );

  const { execute: deliverWork, ...deliverState } = useApi(
    useCallback((deliveryData) => freelanceAPI.missions.deliver(deliveryData), []) // ✅ Correction: deliver()
  );

  const { execute: validateDelivery, ...validateState } = useApi(
    useCallback((deliveryId) => freelanceAPI.missions.validateDelivery(deliveryId), [])
  );

  // ... autres méthodes freelance
};

// 🔔 NOTIFICATIONS - CORRIGÉ
export const useNotificationsApi = () => {
  const { execute: getMyNotifications, ...notificationsState } = useApi(
    useCallback(() => notificationsAPI.my(), []) // ✅ Correction: my()
  );

  const { execute: markAsRead, ...markReadState } = useApi(
    useCallback((notificationId) => notificationsAPI.markRead(notificationId), []) // ✅ Correction: markRead()
  );

  const { execute: markAllAsRead, ...markAllReadState } = useApi(
    useCallback(() => notificationsAPI.markAllRead(), []) // ✅ Correction: markAllRead()
  );

  const { execute: sendBulkNotification, ...bulkState } = useApi(
    useCallback((notificationData) => notificationsAPI.adminBulk(notificationData), []) // ✅ Correction: adminBulk()
  );

  // ... autres méthodes notifications
};

// 🤖 ASSISTANT IA - CORRIGÉ
export const useAIAssistantApi = () => {
  const { execute: sendMessage, ...messageState } = useApi(
    useCallback((messageData) => aiAPI.sendMessage(messageData), []) // ✅ Correction: aiAPI
  );

  const { execute: generateContent, ...contentState } = useApi(
    useCallback((contentData) => aiAPI.generate(contentData), []) // ✅ Correction: generate()
  );

  const { execute: listConversations, ...conversationsState } = useApi(
    useCallback((params = {}) => aiAPI.conversations.list(params), [])
  );

  // ... autres méthodes AI
};

// 📦 PRODUITS - CORRIGÉ
export const useProductsApi = () => {
  const { execute: getAllProducts, ...productsState } = useApi(
    useCallback((params = {}) => productsAPI.all(params), []) // ✅ Correction: all()
  );

  const { execute: getMyProducts, ...myProductsState } = useApi(
    useCallback(() => productsAPI.my(), []) // ✅ Correction: my()
  );

  // ... autres méthodes products
};

// 📊 STATISTIQUES - CORRIGÉ
export const useStatsApi = () => {
  const { execute: getAdminStats, ...adminStatsState } = useApi(
    useCallback(() => statsAPI.admin(), []) // ✅ Correction: admin()
  );

  const { execute: getUserStats, ...userStatsState } = useApi(
    useCallback(() => statsAPI.user(), []) // ✅ Correction: user()
  );

  // ... autres méthodes stats
};

// 🏪 PROVIDERS DE PAIEMENT - CORRIGÉ
export const usePaymentProvidersApi = () => {
  const { execute: getActiveProvider, ...activeProviderState } = useApi(
    useCallback(() => providersAPI.active(), []) // ✅ Correction: active()
  );

  const { execute: getAllProviders, ...allProvidersState } = useApi(
    useCallback(() => providersAPI.adminAll(), []) // ✅ Correction: adminAll()
  );

  const { execute: createProvider, ...createProviderState } = useApi(
    useCallback((providerData) => providersAPI.create(providerData), [])
  );

  // ... autres méthodes providers
};
