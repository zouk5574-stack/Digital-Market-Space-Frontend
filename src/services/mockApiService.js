// src/services/mockApiService.js
// =============================================
// SERVICE MOCK COMPLET POUR TOUS LES COMPOSANTS
// =============================================

import {
  // Structures existantes
  mockUser, mockSeller, mockAdmin, mockUsers,
  mockCategories, mockTags, mockProducts, mockStats,
  mockOrders, mockMissions, mockWithdrawals, mockPaymentProvider,
  mockNotifications, mockChatConversations, mockMissionApplications,
  mockDeliveries, mockPaymentProviders, mockAIConversations,
  
  // Nouvelles structures à ajouter
  mockPlatformSettings,
  mockFedapayConfig,
  mockTransactions,
  mockAdminWithdrawals,
  mockFiles,
  mockActiveSessions,
  mockExtendedStats,
  mockSecuritySettings,
  
  // Fonctions utilitaires
  mockResponse, mockPaginatedResponse, simulateNetworkDelay,
  verifyCredentials, verifyAdminCredentials, findUserById, findProductById
} from '../mocks/staticData';

// 🔐 AUTHENTIFICATION MOCK (EXISTANT - MAINTENU)
export const mockAuthAPI = {
  login: async (credentials) => {
    const result = verifyCredentials(credentials.identifier, credentials.password);
    return mockResponse(result, result.success);
  },

  superAdminLogin: async (data) => {
    const result = verifyAdminCredentials(data.firstname, data.lastname, data.phone, data.adminPassword);
    return mockResponse(result, result.success);
  },

  register: async (userData) => {
    if (userData.email === 'jean.dupont@email.com') {
      return mockResponse({ error: 'Cet email est déjà utilisé' }, false);
    }

    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
      role: 'buyer',
      is_active: true,
      created_at: new Date().toISOString(),
      wallet_balance: 0
    };

    return mockResponse({ user: newUser, session: { access_token: 'mock_new_user_token' } });
  },

  getProfile: async () => {
    return mockResponse({ user: mockUser });
  },

  logout: async () => {
    return mockResponse({ message: 'Déconnexion réussie' });
  }
};

// 🛒 PRODUITS MOCK (AMÉLIORÉ)
export const mockProductsAPI = {
  all: async (params = {}) => {
    let filteredProducts = [...mockProducts];

    // Filtrage par catégories
    if (params.categories) {
      filteredProducts = filteredProducts.filter(product =>
        product.categories?.some(cat => params.categories.includes(cat.id))
      );
    }

    // Filtrage par tags  
    if (params.tags) {
      filteredProducts = filteredProducts.filter(product =>
        product.tags?.some(tag => params.tags.includes(tag.id))
      );
    }

    // Filtrage par recherche
    if (params.q) {
      const searchTerm = params.q.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.title?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrage par prix
    if (params.priceRange) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= params.priceRange[0] && product.price <= params.priceRange[1]
      );
    }

    const paginated = mockPaginatedResponse(filteredProducts, params.page || 1);
    return mockResponse(paginated);
  },

  getById: async (id) => {
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      return mockResponse({ error: 'Produit non trouvé' }, false);
    }
    return mockResponse(product);
  },

  my: async () => {
    // Simule les produits du vendeur connecté
    const myProducts = mockProducts.filter(p => p.owner_id === 'user_002');
    return mockResponse(myProducts);
  },

  create: async (data) => {
    const newProduct = {
      id: `prod_${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'published',
      is_new: true,
      rating: 0,
      review_count: 0,
      seller_name: 'Marie Martin',
      store_name: 'Digital Solutions Pro'
    };
    mockProducts.push(newProduct);
    return mockResponse(newProduct);
  },

  update: async (id, data) => {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return mockResponse({ error: 'Produit non trouvé' }, false);
    }

    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...data,
      updated_at: new Date().toISOString()
    };

    return mockResponse(mockProducts[productIndex]);
  },

  delete: async (id) => {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return mockResponse({ error: 'Produit non trouvé' }, false);
    }

    mockProducts.splice(productIndex, 1);
    return mockResponse({ message: 'Produit supprimé avec succès' });
  }
};

// 📊 CATÉGORIES & TAGS MOCK (AMÉLIORÉ)
export const mockCategoriesAPI = {
  all: async () => {
    return mockResponse(mockCategories);
  },

  getById: async (id) => {
    const category = mockCategories.find(c => c.id === id);
    return category ? mockResponse(category) : mockResponse({ error: 'Catégorie non trouvée' }, false);
  },

  create: async (data) => {
    const newCategory = {
      id: `cat_${Date.now()}`,
      ...data,
      is_active: true,
      product_count: 0,
      created_at: new Date().toISOString()
    };
    mockCategories.push(newCategory);
    return mockResponse(newCategory);
  },

  update: async (id, data) => {
    const categoryIndex = mockCategories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      return mockResponse({ error: 'Catégorie non trouvée' }, false);
    }

    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...data
    };
    return mockResponse(mockCategories[categoryIndex]);
  },

  delete: async (id) => {
    const categoryIndex = mockCategories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      return mockResponse({ error: 'Catégorie non trouvée' }, false);
    }

    mockCategories.splice(categoryIndex, 1);
    return mockResponse({ message: 'Catégorie supprimée avec succès' });
  }
};

export const mockTagsAPI = {
  all: async () => {
    return mockResponse(mockTags);
  },

  create: async (data) => {
    const newTag = {
      id: `tag_${Date.now()}`,
      ...data,
      usage_count: 0
    };
    mockTags.push(newTag);
    return mockResponse(newTag);
  },

  delete: async (id) => {
    const tagIndex = mockTags.findIndex(t => t.id === id);
    if (tagIndex === -1) {
      return mockResponse({ error: 'Tag non trouvé' }, false);
    }

    mockTags.splice(tagIndex, 1);
    return mockResponse({ message: 'Tag supprimé avec succès' });
  }
};

// 💰 COMMANDES & PAIEMENTS MOCK (AMÉLIORÉ)
export const mockOrdersAPI = {
  all: async () => {
    return mockResponse(mockOrders);
  },

  my: async () => {
    return mockResponse(mockOrders);
  },

  sales: async () => {
    const sales = mockOrders.filter(order => order.vendor_id === 'user_002');
    return mockResponse(sales);
  },

  updateStatus: async (id, status) => {
    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      return mockResponse({ error: 'Commande non trouvée' }, false);
    }

    order.status = status;
    return mockResponse(order);
  }
};

export const mockPaymentsAPI = {
  init: async (data) => {
    const order = {
      id: `order_${Date.now()}`,
      ...data,
      status: 'pending_payment',
      payment_status: 'pending',
      order_date: new Date().toISOString(),
      order_items: [
        {
          id: `item_${Date.now()}`,
          product: {
            title: data.description,
            file_url: '/downloads/temp-file.zip'
          }
        }
      ]
    };
    mockOrders.push(order);

    return mockResponse({ 
      order,
      requires_payment: data.amount > 0,
      payment_url: data.amount > 0 ? 'https://fedapay.checkout/mock' : null
    });
  },

  verify: async (data) => {
    return mockResponse({
      status: 'success',
      transaction_id: 'mock_transaction_12345',
      order_id: data.order_id
    });
  },

  // NOUVEAU : Transactions détaillées
  transactions: async () => {
    return mockResponse(mockTransactions || []);
  }
};

// 🏦 FEDAPAY MOCK (COMPLÉTÉ)
export const mockFedapayAPI = {
  initPayment: async (data) => {
    return mockResponse({
      checkout_url: 'https://fedapay.checkout/mock-payment',
      transaction_id: 'mock_fedapay_12345'
    });
  },

  initEscrow: async (data) => {
    return mockResponse({
      checkout_url: 'https://fedapay.checkout/mock-escrow', 
      escrow_id: 'mock_escrow_12345'
    });
  },

  setKeys: async (data) => {
    // Met à jour la configuration Fedapay
    if (mockFedapayConfig) {
      Object.assign(mockFedapayConfig, data);
    }
    return mockResponse({ message: 'Clés Fedapay sauvegardées' });
  },

  adminKeys: async () => {
    return mockResponse(mockFedapayConfig || mockPaymentProvider);
  }
};

// 💸 RETRAITS MOCK (COMPLÉTÉ)
export const mockWithdrawalsAPI = {
  all: async () => {
    return mockResponse(mockWithdrawals);
  },

  my: async () => {
    return mockResponse(mockWithdrawals.filter(w => w.user_id === 'user_002'));
  },

  create: async (data) => {
    const newWithdrawal = {
      id: `with_${Date.now()}`,
      ...data,
      status: 'pending',
      user_id: 'user_002',
      user_name: 'Marie Martin',
      created_at: new Date().toISOString()
    };
    mockWithdrawals.push(newWithdrawal);
    return mockResponse(newWithdrawal);
  },

  // NOUVEAU : Pour admin
  approve: async (id) => {
    const withdrawal = mockWithdrawals.find(w => w.id === id);
    if (!withdrawal) {
      return mockResponse({ error: 'Retrait non trouvé' }, false);
    }

    withdrawal.status = 'approved';
    return mockResponse(withdrawal);
  },

  reject: async (id, reason) => {
    const withdrawal = mockWithdrawals.find(w => w.id === id);
    if (!withdrawal) {
      return mockResponse({ error: 'Retrait non trouvé' }, false);
    }

    withdrawal.status = 'rejected';
    withdrawal.rejection_reason = reason;
    return mockResponse(withdrawal);
  }
};

// 🎯 MISSIONS FREELANCE MOCK (COMPLÉTÉ)
export const mockFreelanceAPI = {
  missions: {
    list: async () => {
      return mockResponse(mockMissions);
    },

    getById: async (id) => {
      const mission = mockMissions.find(m => m.id === id);
      return mission ? mockResponse(mission) : mockResponse({ error: 'Mission non trouvée' }, false);
    },

    create: async (data) => {
      const newMission = {
        id: `mission_${Date.now()}`,
        ...data,
        status: 'open',
        created_at: new Date().toISOString(),
        applications: []
      };
      mockMissions.push(newMission);
      return mockResponse(newMission);
    },

    // NOUVEAU : Applications aux missions
    apply: async (applicationData) => {
      const newApplication = {
        id: `app_${Date.now()}`,
        ...applicationData,
        status: 'pending',
        created_at: new Date().toISOString(),
        freelancer_name: 'Jean Dupont'
      };
      
      if (mockMissionApplications) {
        mockMissionApplications.push(newApplication);
      }
      return mockResponse(newApplication);
    },

    acceptApplication: async (applicationId) => {
      return mockResponse({
        checkout_url: 'https://fedapay.checkout/mock-escrow-mission',
        escrow_id: 'mock_escrow_mission_12345'
      });
    },

    deliver: async (deliveryData) => {
      const newDelivery = {
        id: `delivery_${Date.now()}`,
        ...deliveryData,
        status: 'awaiting_validation',
        created_at: new Date().toISOString()
      };
      
      if (mockDeliveries) {
        mockDeliveries.push(newDelivery);
      }
      return mockResponse(newDelivery);
    },

    validateDelivery: async (deliveryId) => {
      if (mockDeliveries) {
        const delivery = mockDeliveries.find(d => d.id === deliveryId);
        if (delivery) {
          delivery.status = 'completed';
          return mockResponse(delivery);
        }
      }
      throw new Error('Livraison non trouvée');
    }
  }
};

// 🔧 ADMIN MOCK (COMPLÉTÉ)
export const mockAdminAPI = {
  users: {
    list: async () => {
      return mockResponse({ users: mockUsers });
    },

    update: async (id, data) => {
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        return mockResponse({ error: 'Utilisateur non trouvé' }, false);
      }

      Object.assign(user, data);
      return mockResponse(user);
    },

    delete: async (id) => {
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return mockResponse({ error: 'Utilisateur non trouvé' }, false);
      }

      mockUsers.splice(userIndex, 1);
      return mockResponse({ message: 'Utilisateur supprimé' });
    }
  },

  withdrawals: {
    list: async () => {
      return mockResponse({ withdrawals: mockWithdrawals });
    },

    approve: async (id) => {
      const withdrawal = mockWithdrawals.find(w => w.id === id);
      if (!withdrawal) {
        return mockResponse({ error: 'Retrait non trouvé' }, false);
      }

      withdrawal.status = 'approved';
      return mockResponse(withdrawal);
    },

    reject: async (id, reason) => {
      const withdrawal = mockWithdrawals.find(w => w.id === id);
      if (!withdrawal) {
        return mockResponse({ error: 'Retrait non trouvé' }, false);
      }

      withdrawal.status = 'rejected';
      withdrawal.rejection_reason = reason;
      return mockResponse(withdrawal);
    }
  },

  // NOUVEAU : Paramètres plateforme
  settings: {
    get: async () => {
      return mockResponse({
        ...mockPlatformSettings,
        security: mockSecuritySettings
      });
    },

    update: async (settings) => {
      if (settings.platform_name) mockPlatformSettings.platform_name = settings.platform_name;
      if (settings.currency) mockPlatformSettings.currency = settings.currency;
      if (settings.default_commission) mockPlatformSettings.default_commission = settings.default_commission;
      if (settings.security) Object.assign(mockSecuritySettings, settings.security);
      
      return mockResponse(mockPlatformSettings);
    }
  },

  // NOUVEAU : Commission
  commission: {
    update: async (data) => {
      mockPlatformSettings.default_commission = data.commissionRate;
      return mockResponse({ success: true });
    }
  },

  // NOUVEAU : Statistiques étendues
  stats: async () => {
    return mockResponse(mockExtendedStats || mockStats.admin);
  }
};

// 📁 FICHIERS MOCK (COMPLÉTÉ)
export const mockFilesAPI = {
  signedUrl: async (fileId) => {
    return mockResponse({
      url: `https://storage.digitalmarketspace.com/mock-signed-url/${fileId}`,
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    });
  },

  publicUrl: async (fileId) => {
    return mockResponse({
      url: `https://storage.digitalmarketspace.com/mock-public-url/${fileId}`
    });
  },

  // NOUVEAU : Upload de fichiers
  upload: async (formData) => {
    const newFile = {
      id: `file_${Date.now()}`,
      filename: 'uploaded-file.zip',
      size_bytes: 1024000,
      content_type: 'application/zip',
      url: '/downloads/uploaded-file.zip',
      uploaded_by: 'user_001',
      created_at: new Date().toISOString()
    };
    
    if (mockFiles) {
      mockFiles.push(newFile);
    }
    return mockResponse(newFile);
  }
};

// 💬 CHAT & MESSAGERIE MOCK (NOUVEAU)
export const mockChatAPI = {
  conversations: async () => {
    return mockResponse(mockChatConversations || []);
  },

  messages: async (conversationId) => {
    const conversation = mockChatConversations?.find(conv => conv.id === conversationId);
    return mockResponse(conversation ? conversation.messages : []);
  },

  sendMessage: async (messageData) => {
    const conversation = mockChatConversations?.find(conv => conv.id === messageData.conversation_id);
    if (conversation) {
      const newMessage = {
        id: `msg_${Date.now()}`,
        sender_id: 'user_001',
        content: messageData.content,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      conversation.messages.push(newMessage);
      conversation.last_message_content = messageData.content;
      conversation.last_message_at = new Date().toISOString();
      
      return mockResponse(newMessage);
    }
    throw new Error('Conversation non trouvée');
  }
};

// 🔒 SÉCURITÉ MOCK (NOUVEAU)
export const mockSecurityAPI = {
  getSessions: async () => {
    return mockResponse(mockActiveSessions || []);
  },

  terminateSession: async (sessionId) => {
    if (mockActiveSessions) {
      const index = mockActiveSessions.findIndex(session => session.id === sessionId);
      if (index !== -1) {
        mockActiveSessions.splice(index, 1);
        return mockResponse({ success: true });
      }
    }
    throw new Error('Session non trouvée');
  }
};

// 🤖 IA ASSISTANT MOCK (NOUVEAU)
export const mockAIAssistantAPI = {
  conversations: async () => {
    return mockResponse(mockAIConversations || []);
  },

  sendMessage: async (conversationId, message) => {
    let conversation = mockAIConversations?.find(conv => conv.id === conversationId);
    
    if (!conversation && mockAIConversations) {
      conversation = {
        id: conversationId,
        title: 'Nouvelle conversation',
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockAIConversations.push(conversation);
    }

    if (conversation) {
      // Message utilisateur
      conversation.messages.push({
        id: `msg_${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });

      // Réponse IA simulée
      const aiResponse = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: `Je comprends votre demande concernant "${message}". Comment puis-je vous aider davantage ?`,
        timestamp: new Date().toISOString()
      };
      
      conversation.messages.push(aiResponse);
      conversation.updated_at = new Date().toISOString();
      
      return mockResponse(aiResponse);
    }
    
    throw new Error('Erreur de conversation IA');
  }
};

// 📈 STATISTIQUES MOCK (EXISTANT - MAINTENU)
export const mockStatsAPI = {
  admin: async () => {
    return mockResponse(mockExtendedStats || mockStats.admin);
  },

  user: async () => {
    return mockResponse(mockStats.user);
  }
};

// 🌐 PROVIDERS MOCK (EXISTANT - MAINTENU)
export const mockProvidersAPI = {
  active: async () => {
    return mockResponse(mockPaymentProvider);
  }
};

// 🔔 NOTIFICATIONS MOCK (NOUVEAU)
export const mockNotificationsAPI = {
  list: async () => {
    return mockResponse(mockNotifications || []);
  },

  markAsRead: async (notificationId) => {
    if (mockNotifications) {
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        return mockResponse(notification);
      }
    }
    throw new Error('Notification non trouvée');
  },

  markAllAsRead: async () => {
    if (mockNotifications) {
      mockNotifications.forEach(notification => {
        notification.read = true;
      });
    }
    return mockResponse({ message: 'Toutes les notifications marquées comme lues' });
  }
};

// =============================================
// EXPORT UNIFIÉ POUR TOUS LES SERVICES
// =============================================

export const mockApiService = {
  auth: mockAuthAPI,
  products: mockProductsAPI,
  categories: mockCategoriesAPI,
  tags: mockTagsAPI,
  stats: mockStatsAPI,
  orders: mockOrdersAPI,
  payments: mockPaymentsAPI,
  fedapay: mockFedapayAPI,
  freelance: mockFreelanceAPI,
  withdrawals: mockWithdrawalsAPI,
  admin: mockAdminAPI,
  providers: mockProvidersAPI,
  files: mockFilesAPI,
  chat: mockChatAPI,
  security: mockSecurityAPI,
  aiAssistant: mockAIAssistantAPI,
  notifications: mockNotificationsAPI
};

export default mockApiService;