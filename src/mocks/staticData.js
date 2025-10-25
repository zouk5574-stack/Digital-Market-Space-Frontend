// src/mocks/staticData.js
// =============================================
// MOCK DATA FOR DIGITAL MARKET SPACE - VERSION COMPLÈTE
// Données réalistes pour développement frontend
// =============================================

// 🔐 AUTHENTIFICATION & UTILISATEURS (MIS À JOUR)
export const mockUser = {
  id: 'user_001',
  firstname: 'Jean',
  lastname: 'Dupont',
  username: 'jeandupont',
  email: 'jean.dupont@email.com',
  tel: '+33612345678',
  role: 'buyer',
  is_active: true,
  created_at: '2024-01-15T10:30:00Z',
  avatar_url: null,
  wallet_balance: 15000,
  bio: 'Entrepreneur passionné par le digital',
  // NOUVEAU: Pour la navbar et layouts
  name: 'Jean Dupont'
};

export const mockSeller = {
  id: 'user_002',
  firstname: 'Marie',
  lastname: 'Martin',
  username: 'mariemartin',
  email: 'marie.martin@email.com',
  tel: '+33623456789',
  role: 'seller',
  is_active: true,
  created_at: '2024-01-20T14:20:00Z',
  avatar_url: null,
  wallet_balance: 45000,
  store_name: 'Digital Solutions Pro',
  bio: 'Créatrice de contenus digitaux',
  // NOUVEAU: Pour la navbar et layouts
  name: 'Marie Martin'
};

export const mockAdmin = {
  id: 'admin_001',
  firstname: 'Admin',
  lastname: 'System',
  username: 'admin',
  email: 'admin@digitalmarketspace.com',
  tel: '+33698765432',
  role: 'admin',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  permissions: ['all'],
  // NOUVEAU: Pour la navbar et layouts
  name: 'Admin System'
};

export const mockUsers = [mockUser, mockSeller, mockAdmin];

// 🛒 CATÉGORIES
export const mockCategories = [
  {
    id: 'cat_001',
    name: 'Templates',
    slug: 'templates',
    is_active: true,
    product_count: 8,
    description: 'Modèles et templates pour vos projets',
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 'cat_002',
    name: 'Services Design',
    slug: 'services-design',
    is_active: true,
    product_count: 5,
    description: 'Services de design graphique et web',
    created_at: '2024-01-11T00:00:00Z'
  },
  {
    id: 'cat_003',
    name: 'Applications',
    slug: 'applications',
    is_active: true,
    product_count: 3,
    description: 'Applications et logiciels',
    created_at: '2024-01-12T00:00:00Z'
  },
  {
    id: 'cat_004',
    name: 'Formations',
    slug: 'formations',
    is_active: false,
    product_count: 0,
    description: 'Cours et formations en ligne',
    created_at: '2024-01-13T00:00:00Z'
  }
];

// 🏷️ TAGS
export const mockTags = [
  { id: 'tag_001', name: 'React', usage_count: 5, category_id: 'cat_001' },
  { id: 'tag_002', name: 'E-commerce', usage_count: 3, category_id: 'cat_001' },
  { id: 'tag_003', name: 'Responsive', usage_count: 7, category_id: 'cat_001' },
  { id: 'tag_004', name: 'Logo', usage_count: 4, category_id: 'cat_002' },
  { id: 'tag_005', name: 'UI/UX', usage_count: 6, category_id: 'cat_002' },
  { id: 'tag_006', name: 'SaaS', usage_count: 2, category_id: 'cat_003' },
  { id: 'tag_007', name: 'Mobile', usage_count: 3, category_id: 'cat_003' }
];

// 📦 PRODUITS
export const mockProducts = [
  {
    id: 'prod_001',
    title: 'Template E-commerce React',
    name: 'Template E-commerce React',
    description: 'Template moderne et responsive pour site e-commerce développé avec React et Tailwind CSS. Inclut panier, paiement et dashboard admin.',
    price: 149.99,
    category: 'digital_product',
    categories: [mockCategories[0]],
    tags: [mockTags[0], mockTags[1], mockTags[2]],
    media_urls: ['/images/template-ecommerce.jpg'],
    seller_name: 'Pierre Bernard',
    store_name: 'Dev Templates Pro',
    owner_id: 'user_003',
    is_new: true,
    status: 'published',
    rating: 4.8,
    review_count: 42,
    file_size: '15.2 MB',
    created_at: '2024-01-25T16:45:00Z',
    updated_at: '2024-01-25T16:45:00Z',
    files: [
      {
        id: 'file_001',
        filename: 'template-ecommerce.zip',
        size_bytes: 15925248,
        content_type: 'application/zip',
        url: '/downloads/template-ecommerce.zip'
      }
    ]
  },
  {
    id: 'prod_002',
    title: 'Service Design Logo Premium',
    name: 'Service Design Logo Premium',
    description: 'Création de logo professionnel avec 3 propositions et fichiers vectoriels inclus. Livraison sous 7 jours.',
    price: 299.99,
    category: 'service',
    categories: [mockCategories[1]],
    tags: [mockTags[3], mockTags[4]],
    media_urls: ['/images/logo-design.jpg'],
    seller_name: 'Marie Martin',
    store_name: 'Digital Solutions Pro',
    owner_id: 'user_002',
    is_new: false,
    status: 'published',
    rating: 4.9,
    review_count: 28,
    delivery_time: '7 jours',
    created_at: '2024-01-22T09:30:00Z'
  },
  {
    id: 'prod_003',
    title: 'Application SaaS Gestion Projet',
    name: 'Application SaaS Gestion Projet',
    description: 'Application complète de gestion de projet avec tableaux Kanban, rapports avancés et collaboration en temps réel.',
    price: 499.99,
    category: 'digital_product',
    categories: [mockCategories[2]],
    tags: [mockTags[5], mockTags[6]],
    media_urls: ['/images/saas-project.jpg'],
    seller_name: 'Jean Dupont',
    store_name: 'SaaS Solutions',
    owner_id: 'user_001',
    is_new: true,
    status: 'published',
    rating: 4.7,
    review_count: 15,
    file_size: '45.8 MB',
    created_at: '2024-01-28T14:15:00Z'
  }
];

// 📊 STATISTIQUES
export const mockStats = {
  admin: {
    total_users: 156,
    total_products: 89,
    total_orders: 234,
    total_revenue: 125000,
    platform_balance: 45000,
    commission_rate: 10,
    pending_withdrawals: 3,
    monthly_revenue: [
      { month: 'Jan', revenue: 45000 },
      { month: 'Fév', revenue: 52000 },
      { month: 'Mar', revenue: 28000 }
    ]
  },
  user: {
    purchases_count: 5,
    total_purchases: 1250,
    successful_purchases_count: 4,
    wallet_balance: 15000
  }
};

// 💰 COMMANDES & TRANSACTIONS
export const mockOrders = [
  {
    id: 'order_001',
    user_id: 'user_001',
    product_id: 'prod_002',
    product_name: 'Service Design Logo Premium',
    vendor_id: 'user_002',
    amount: 299.99,
    status: 'completed',
    payment_status: 'paid',
    payment_method: 'stripe',
    order_date: '2024-01-26T10:30:00Z',
    completed_date: '2024-02-02T14:20:00Z',
    order_items: [
      {
        id: 'item_001',
        product: {
          title: 'Service Design Logo Premium',
          file_url: '/downloads/logo-design.zip'
        }
      }
    ]
  },
  {
    id: 'order_002',
    user_id: 'user_001',
    product_id: 'prod_001',
    product_name: 'Template E-commerce React',
    vendor_id: 'user_003',
    amount: 149.99,
    status: 'completed',
    payment_status: 'paid',
    payment_method: 'paypal',
    order_date: '2024-01-30T16:45:00Z',
    download_url: '/downloads/template-ecommerce.zip',
    download_count: 3,
    download_limit: 5,
    order_items: [
      {
        id: 'item_002',
        product: {
          title: 'Template E-commerce React',
          file_url: '/downloads/template-ecommerce.zip'
        }
      }
    ]
  }
];

// 🎯 MISSIONS FREELANCE
export const mockMissions = [
  {
    id: 'mission_001',
    title: 'Développement Site E-commerce',
    description: 'Création d\'un site e-commerce responsive avec React et Node.js',
    detailed_description: 'Développement complet d\'un site e-commerce avec gestion des produits, panier, système de paiement et dashboard admin. Le site doit être responsive et optimisé SEO.',
    status: 'in_progress',
    client_name: 'Client Entreprise',
    client_email: 'client@entreprise.com',
    budget: 1500,
    deadline: '2024-02-15',
    created_at: '2024-01-10T00:00:00Z',
    start_date: '2024-01-15T00:00:00Z',
    skills_required: ['React', 'Node.js', 'MongoDB', 'Responsive Design'],
    deliverables: 'Site e-commerce fonctionnel, documentation technique, formation utilisateur',
    deliveries: [
      {
        id: 1,
        delivered_at: '2024-01-20T00:00:00Z',
        notes: 'Première version du frontend',
        status: 'approved'
      }
    ]
  }
];

// 💸 RETRAITS
export const mockWithdrawals = [
  {
    id: 'with_001',
    user_id: 'user_002',
    user_name: 'Marie Martin',
    amount: 25000,
    status: 'pending',
    payment_method: 'bank_transfer',
    created_at: '2024-02-01T09:00:00Z'
  }
];

// 🔑 CONFIGURATION FEDAPAY
export const mockPaymentProvider = {
  id: 'fedapay_001',
  name: 'Fedapay',
  is_active: true,
  public_key: 'pk_test_123456789',
  secret_key: 'sk_test_123456789',
  webhook_secret: 'whsec_123456789'
};

// 🆕 NOTIFICATIONS (NOUVEAU)
export const mockNotifications = [
  {
    id: 'notif_001',
    title: 'Nouvelle commande reçue',
    message: 'Votre produit "Template E-commerce React" a été acheté',
    type: 'order',
    read: false,
    created_at: '2024-02-01T14:30:00Z',
    metadata: { order_id: 'order_001', product_id: 'prod_001' }
  },
  {
    id: 'notif_002',
    title: 'Paiement confirmé',
    message: 'Votre retrait de 25,000 XOF a été approuvé',
    type: 'withdrawal',
    read: true,
    created_at: '2024-01-30T09:15:00Z',
    metadata: { withdrawal_id: 'with_001' }
  },
  {
    id: 'notif_003',
    title: 'Nouveau message',
    message: 'Vous avez reçu un nouveau message sur votre mission',
    type: 'message',
    read: false,
    created_at: '2024-02-01T16:45:00Z',
    metadata: { mission_id: 'mission_001', conversation_id: 'conv_001' }
  }
];

// 🆕 CONVERSATIONS IA (NOUVEAU)
export const mockAIConversations = [
  {
    id: 'ai_conv_001',
    title: 'Aide création produit digital',
    last_message: 'Quel type de produit souhaitez-vous créer ?',
    created_at: '2024-01-28T10:30:00Z',
    updated_at: '2024-02-01T15:20:00Z',
    messages: [
      {
        id: 'msg_001',
        role: 'user',
        content: 'Je veux créer un template e-commerce',
        timestamp: '2024-01-28T10:30:00Z'
      },
      {
        id: 'msg_002', 
        role: 'assistant',
        content: 'Quel type de template e-commerce souhaitez-vous créer ?',
        timestamp: '2024-01-28T10:31:00Z'
      }
    ]
  }
];

// 🆕 APPLICATIONS MISSIONS (NOUVEAU)
export const mockMissionApplications = [
  {
    id: 'app_001',
    mission_id: 'mission_001',
    freelancer_id: 'user_001',
    freelancer_name: 'Jean Dupont',
    proposal: 'Je propose de développer votre site e-commerce avec React et Node.js',
    budget: 1200,
    status: 'pending',
    created_at: '2024-01-25T11:20:00Z',
    delivery_time: '30 jours'
  }
];

// 🆕 PROVIDERS DE PAIEMENT (NOUVEAU)
export const mockPaymentProviders = [
  {
    id: 'provider_001',
    name: 'Fedapay',
    type: 'payment_gateway',
    is_active: true,
    credentials: {
      public_key: 'pk_test_123456789',
      secret_key: 'sk_test_123456789'
    },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'provider_002', 
    name: 'Stripe',
    type: 'payment_gateway',
    is_active: false,
    credentials: {},
    created_at: '2024-01-02T00:00:00Z'
  }
];

// 🆕 MENU ITEMS POUR DASHBOARD (NOUVEAU)
export const mockMenuItems = {
  admin: [
    { name: 'Tableau de bord', path: '/admin/dashboard' },
    { name: 'Utilisateurs', path: '/admin/users' },
    { name: 'Produits', path: '/admin/products' },
    { name: 'Commandes', path: '/admin/orders' },
    { name: 'Catégories', path: '/admin/categories' },
    { name: 'Tags', path: '/admin/tags' },
    { name: 'Paramètres', path: '/admin/settings' },
    { name: 'Sécurité', path: '/admin/security' }
  ],
  buyer: [
    { name: 'Vue Générale', path: '/buyer/dashboard' },
    { name: 'Produits Digitaux', path: '/buyer/products' },
    { name: 'Boutique', path: '/buyer/boutique' },
    { name: 'Mes Achats', path: '/buyer/orders' },
    { name: 'Mes Missions', path: '/buyer/missions' }
  ],
  seller: [
    { name: 'Vue Générale', path: '/seller/dashboard' },
    { name: 'Mes Produits', path: '/seller/products' },
    { name: 'Boutique', path: '/seller/boutique' },
    { name: 'Mes Ventes', path: '/seller/sales' },
    { name: 'Missions Freelance', path: '/seller/missions' },
    { name: 'Mes Candidatures', path: '/seller/applications' }
  ]
};

// 🆕 CONTACT INFO POUR FOOTER (NOUVEAU)
export const mockContactInfo = {
  email: 'digitalmarketspace488@gmail.com',
  phone: '+2290140410161',
  address: 'Avenue du Digital\nMade in Bénin ** Valorisons La Tech Et L\'Innovation Béninoise **',
  social_media: {
    facebook: '#',
    twitter: '#', 
    instagram: '#',
    linkedin: '#'
  }
};

// 🆕 CHAT & MESSAGERIE (NOUVEAU)
export const mockChatConversations = [
  {
    id: 'conv_001',
    mission_id: 'mission_001',
    participants: ['user_001', 'user_002'],
    last_message: 'Je vais vous envoyer la première version demain',
    last_message_at: '2024-02-01T16:30:00Z',
    unread_count: 2,
    messages: [
      {
        id: 'msg_001',
        sender_id: 'user_001',
        content: 'Bonjour, où en êtes-vous sur le développement ?',
        timestamp: '2024-01-30T10:00:00Z',
        read: true
      },
      {
        id: 'msg_002',
        sender_id: 'user_002', 
        content: 'Je vais vous envoyer la première version demain',
        timestamp: '2024-02-01T16:30:00Z',
        read: false
      }
    ]
  }
];

// 🔐 CRÉDENTIALS POUR TESTS
export const mockCredentials = {
  standard: {
    identifier: 'jeandupont', // ou '+33612345678'
    password: 'password123'
  },
  admin: {
    firstname: 'Admin',
    lastname: 'System', 
    phone: '+33698765432',
    adminPassword: 'admin123'
  },
  newUser: {
    firstname: 'Nouveau',
    lastname: 'Utilisateur',
    username: 'nouveauuser',
    email: 'nouveau@email.com',
    tel: '+33600000000',
    password: 'password123'
  }
};

// =============================================
// FONCTIONS UTILITAIRES POUR LES MOCKS
// =============================================

// Simule un délai réseau réaliste
export const simulateNetworkDelay = (ms = 800) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Génère une réponse mockée standardisée
export const mockResponse = (data, success = true, delay = 600) => 
  simulateNetworkDelay(delay).then(() => ({
    success,
    data,
    timestamp: new Date().toISOString()
  }));

// Génère une réponse paginée
export const mockPaginatedResponse = (items, page = 1, pageSize = 12) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    pagination: {
      current_page: page,
      total_pages: Math.ceil(items.length / pageSize),
      total_items: items.length,
      page_size: pageSize,
      has_next: endIndex < items.length,
      has_prev: page > 1
    }
  };
};

// Vérifie les credentials de connexion
export const verifyCredentials = (identifier, password) => {
  const isStandardUser = (
    (identifier === mockCredentials.standard.identifier || identifier === mockUser.tel) &&
    password === mockCredentials.standard.password
  );

  return isStandardUser ? { 
    success: true, 
    user: mockUser, 
    session: { access_token: 'mock_token_12345' }
  } : { 
    success: false, 
    error: 'Identifiants incorrects' 
  };
};

// Vérifie les credentials admin
export const verifyAdminCredentials = (firstname, lastname, phone, adminPassword) => {
  const isAdmin = (
    firstname === mockCredentials.admin.firstname &&
    lastname === mockCredentials.admin.lastname &&
    phone === mockCredentials.admin.phone &&
    adminPassword === mockCredentials.admin.adminPassword
  );

  return isAdmin ? { 
    success: true, 
    user: mockAdmin, 
    session: { access_token: 'mock_admin_token_12345' }
  } : { 
    success: false, 
    error: 'Identifiants administrateur incorrects' 
  };
};

// Trouve un utilisateur par ID
export const findUserById = (userId) => {
  return mockUsers.find(user => user.id === userId) || mockUser;
};

// Trouve un produit par ID
export const findProductById = (productId) => {
  return mockProducts.find(product => product.id === productId) || mockProducts[0];
};

// Filtre les produits par catégorie
export const filterProductsByCategory = (categoryId) => {
  return mockProducts.filter(product => 
    product.categories.some(cat => cat.id === categoryId)
  );
};

// Filtre les produits par tag
export const filterProductsByTag = (tagId) => {
  return mockProducts.filter(product =>
    product.tags.some(tag => tag.id === tagId)
  );
};