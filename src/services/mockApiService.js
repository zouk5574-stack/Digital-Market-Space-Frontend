// src/services/mockApiService.js
// =============================================
// SERVICE MOCK POUR INTERCEPTER LES APPELS API
// Remplace les appels axios vers le backend
// =============================================

import {
  mockUser, mockSeller, mockAdmin, mockUsers,
  mockCategories, mockTags, mockProducts, mockStats,
  mockOrders, mockMissions, mockWithdrawals, mockPaymentProvider,
  mockResponse, mockPaginatedResponse, verifyCredentials, verifyAdminCredentials
} from '../mocks/staticData';

// 🔐 AUTHENTIFICATION MOCK
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
    // Simule une vérification d'email existant
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

// 🛒 PRODUITS MOCK
export const mockProductsAPI = {
  all: async (params = {}) => {
    let filteredProducts = [...mockProducts];
    
    // Filtrage par catégories
    if (params.categories) {
      filteredProducts = filteredProducts.filter(product =>
        product.categories.some(cat => params.categories.includes(cat.id))
      );
    }
    
    // Filtrage par tags  
    if (params.tags) {
      filteredProducts = filteredProducts.filter(product =>
        product.tags.some(tag => params.tags.includes(tag.id))
      );
    }
    
    // Filtrage par recherche
    if (params.q) {
      const searchTerm = params.q.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
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
      review_count: 0
    };
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

// 📊 CATÉGORIES & TAGS MOCK
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
    return mockResponse(newCategory);
  },

  update: async (id, data) => {
    const category = mockCategories.find(c => c.id === id);
    if (!category) {
      return mockResponse({ error: 'Catégorie non trouvée' }, false);
    }
    
    Object.assign(category, data);
    return mockResponse(category);
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

// 📈 STATISTIQUES MOCK
export const mockStatsAPI = {
  admin: async () => {
    return mockResponse(mockStats.admin);
  },

  user: async () => {
    return mockResponse(mockStats.user);
  }
};

// 💰 COMMANDES & PAIEMENTS MOCK
export const mockOrdersAPI = {
  all: async () => {
    return mockResponse(mockOrders);
  },

  my: async () => {
    return mockResponse(mockOrders);
  },

  sales: async () => {
    // Simule les ventes du vendeur
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
    // Simule la création d'une commande + préparation paiement
    const order = {
      id: `order_${Date.now()}`,
      ...data,
      status: 'pending_payment',
      created_at: new Date().toISOString()
    };
    
    return mockResponse({ 
      order,
      requires_payment: data.amount > 0,
      payment_url: data.amount > 0 ? 'https://fedapay.checkout/mock' : null
    });
  },

  verify: async (data) => {
    // Simule une vérification de paiement réussie
    return mockResponse({
      status: 'success',
      transaction_id: 'mock_transaction_12345',
      order_id: data.order_id
    });
  }
};

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
    return mockResponse({ message: 'Clés Fedapay sauvegardées' });
  },

  adminKeys: async () => {
    return mockResponse(mockPaymentProvider);
  }
};

// 🎯 MISSIONS FREELANCE MOCK
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
        created_at: new Date().toISOString()
      };
      return mockResponse(newMission);
    }
  }
};

// 💸 RETRAITS MOCK
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
      created_at: new Date().toISOString()
    };
    return mockResponse(newWithdrawal);
  }
};

// 🔧 ADMIN MOCK
export const mockAdminAPI = {
  users: {
    list: async () => {
      return mockResponse({ users: mockUsers });
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
    }
  }
};

// 🌐 PROVIDERS MOCK
export const mockProvidersAPI = {
  active: async () => {
    return mockResponse(mockPaymentProvider);
  }
};

// 📁 FICHIERS MOCK
export const mockFilesAPI = {
  signedUrl: async (fileId) => {
    return mockResponse({
      url: `https://storage.digitalmarketspace.com/mock-signed-url/${fileId}`,
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 heures
    });
  }
};