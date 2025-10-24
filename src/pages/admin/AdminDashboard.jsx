import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminAPI, statsAPI, productsAPI, providersAPI, fedapayAPI, categoriesAPI, tagsAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import ProductModal from '../../components/admin/ProductModal';
import FedapayConfigModal from '../../components/admin/FedapayConfigModal';
import CommissionSettingsModal from '../../components/admin/CommissionSettingsModal';
import InfoModal from '../../components/ui/InfoModal';
import ErrorModal from '../../components/ui/ErrorModal';
import WithdrawalModal from '../../components/admin/WithdrawalModal';
import PlatformSettingsModal from '../../components/admin/PlatformSettingsModal';
import TransactionDetailsModal from '../../components/admin/TransactionDetailsModal';
import DeleteConfirmModal from '../../components/ui/DeleteConfirmModal';
import ServiceModal from '../../components/modals/ServiceModal';
import ProductList from '../../components/products/ProductList';
import CategoryManager from '../../components/admin/CategoryManager';
import TagSystem from '../../components/admin/TagSystem';
import AdminWithdrawalModal from '../../components/admin/AdminWithdrawalModal';
import AdminEarningsWithdrawalModal from '../../components/admin/AdminEarningsWithdrawalModal';
import toast from 'react-hot-toast';

const menuItems = [
  { name: 'Tableau de bord', path: '/admin/dashboard' },
  { name: 'Utilisateurs', path: '/admin/users' },
  { name: 'Produits', path: '/admin/products' },
  { name: 'Commandes', path: '/admin/orders' },
  { name: 'Catégories', path: '/admin/categories' },
  { name: 'Tags', path: '/admin/tags' },
  { name: 'Paramètres', path: '/admin/settings' },
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentProvider, setPaymentProvider] = useState({});

// ----- Modals States -----
  const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, message: '', onConfirm: null });
  const [productModal, setProductModal] = useState({ isOpen: false, product: null });
  const [fedapayModal, setFedapayModal] = useState(false);
  const [commissionModal, setCommissionModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [adminWithdrawalModal, setAdminWithdrawalModal] = useState(false);
  const [adminEarningsModal, setAdminEarningsModal] = useState(false);
  const [platformSettingsModal, setPlatformSettingsModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState({ isOpen: false, transactionId: null });
  const [serviceModal, setServiceModal] = useState({ isOpen: false, service: null });
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  // ==================== Chargement initial ====================
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, withdrawalsRes, providerRes, categoriesRes, tagsRes] = await Promise.all([
        statsAPI.admin(),
        adminAPI.users.list(),
        productsAPI.my(),
        adminAPI.withdrawals.list(),
        providersAPI.active(),
        categoriesAPI.all(),
        tagsAPI.all(),
      ]);

      setStats(statsRes.data || {});
      setUsers(usersRes.data?.users || usersRes.data || []);
      setProducts(productsRes.data?.products || productsRes.data || []);
      setWithdrawals(withdrawalsRes.data?.withdrawals || withdrawalsRes.data || []);
      setPaymentProvider(providerRes.data || {});
      setCategories(categoriesRes.data?.categories || categoriesRes.data || []);
      setTags(tagsRes.data?.tags || tagsRes.data || []);
      setWalletBalance(statsRes.data?.platform_balance || 0);
    } catch (err) {
      console.error(err);
      toast.error('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

// ==================== Gestion Produits ====================
  const openProductModal = (product = null) => setProductModal({ isOpen: true, product });
  const saveProduct = async (data) => {
    try {
      if (productModal.product) {
        await productsAPI.update(productModal.product.id, data);
      } else {
        await productsAPI.create(data);
      }
      await fetchInitialData();
      setProductModal({ isOpen: false, product: null });
      toast.success('Produit sauvegardé avec succès');
    } catch (err) {
      console.error(err);
      toast.error('Impossible de sauvegarder le produit');
    }
  };

  const deleteProduct = (id) => {
    setDeleteConfirm({
      isOpen: true,
      message: 'Voulez-vous vraiment supprimer ce produit ?',
      onConfirm: async () => {
        try {
          await productsAPI.delete(id);
          setProducts(prev => prev.filter(p => p.id !== id));
          setDeleteConfirm({ isOpen: false, message: '', onConfirm: null });
          toast.success('Produit supprimé avec succès');
        } catch (err) {
          console.error(err);
          toast.error('Impossible de supprimer le produit');
        }
      },
    });
  };

  // ==================== Gestion Retraits ====================
  const handleWithdrawalAction = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setAdminWithdrawalModal(true);
  };

  const handleWithdrawalSuccess = () => {
    fetchInitialData();
    setSelectedWithdrawal(null);
    toast.success('Action sur le retrait effectuée avec succès');
  };

  // ==================== Fedapay ====================
  const saveFedapayKeys = async (keys) => {
    try {
      await fedapayAPI.setKeys(keys);
      setFedapayModal(false);
      const providerRes = await providersAPI.active();
      setPaymentProvider(providerRes.data || {});
      toast.success('Clés Fedapay sauvegardées');
    } catch (err) {
      console.error(err);
      toast.error('Impossible de sauvegarder les clés');
    }
  };

  // ==================== Commission ====================
  const saveCommission = async (rate) => {
    try {
      await adminAPI.commission.update({ commission_rate: rate });
      setCommissionModal(false);
      await fetchInitialData();
      toast.success('Commission mise à jour');
    } catch (err) {
      console.error(err);
      toast.error('Impossible de sauvegarder la commission');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader size="large" /></div>;

  return (
    <DashboardLayout menuItems={menuItems}>
      {/* === HEADER AVEC BOUTONS D'ACTION === */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Tableau de Bord Admin'}
                {activeTab === 'products' && 'Gestion des Produits'}
                {activeTab === 'categories' && 'Gestion des Catégories'}
                {activeTab === 'tags' && 'Gestion des Tags'}
                {activeTab === 'settings' && 'Paramètres Plateforme'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'dashboard' && 'Vue d\'ensemble et statistiques de la plateforme'}
                {activeTab === 'products' && 'Créez et gérez vos produits digitaux'}
                {activeTab === 'categories' && 'Organisez vos produits par catégories'}
                {activeTab === 'tags' && 'Gérez les tags pour un meilleur référencement'}
                {activeTab === 'settings' && 'Configurez les paramètres de la plateforme'}
              </p>
            </div>

            {/* BOUTONS D'ACTION PRINCIPAUX */}
            <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
              {activeTab === 'dashboard' && (
                <>
                  <button 
                    onClick={() => setAdminEarningsModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    💰 Retrait Gains
                  </button>
                  <button 
                    onClick={() => setFedapayModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    🔑 Fedapay
                  </button>
                  <button 
                    onClick={() => setCommissionModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    📊 Commission
                  </button>
                </>
              )}
              
              {activeTab === 'products' && (
                <button 
                  onClick={() => openProductModal()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  + Nouveau Produit
                </button>
              )}
            </div>
          </div>

          {/* NAVIGATION PAR ONGLETS */}
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', name: '📊 Tableau de Bord' },
              { id: 'products', name: '🛍️ Mes Produits' },
              { id: 'categories', name: '📁 Catégories' },
              { id: 'tags', name: '🏷️ Tags' },
              { id: 'settings', name: '⚙️ Paramètres' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

{/* === CONTENU PRINCIPAL === */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* === TABLEAU DE BORD === */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* STATISTIQUES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Utilisateurs', value: stats.total_users || users.length, icon: '👤', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
                { label: 'Produits', value: stats.total_products || products.length, icon: '📦', color: 'green', bg: 'bg-green-50', text: 'text-green-600' },
                { label: 'Catégories', value: categories.length, icon: '📁', color: 'purple', bg: 'bg-purple-50', text: 'text-purple-600' },
                { label: 'Tags', value: tags.length, icon: '🏷️', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-600' },
                { label: 'Retraits en attente', value: withdrawals.length, icon: '💰', color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-600' },
                { label: 'Wallet Plateforme', value: `${walletBalance} XOF`, icon: '🏦', color: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600' },
                { label: 'Ventes Total', value: `${stats.total_sales || 0} XOF`, icon: '💸', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                { label: 'Commission', value: `${stats.commission_rate || 10}%`, icon: '📊', color: 'red', bg: 'bg-red-50', text: 'text-red-600' },
              ].map((stat, index) => (
                <div key={index} className={`${stat.bg} p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}>
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${stat.text} text-2xl`}>
                      {stat.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TABLEAUX EN GRID RESPONSIVE */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* UTILISATEURS */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Utilisateurs Récents</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.slice(0, 5).map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

{/* RETRAITS EN ATTENTE */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Retraits en Attente</h3>
                </div>
                <div className="overflow-y-auto max-h-80">
                  {withdrawals.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {withdrawals.map(withdrawal => (
                        <li key={withdrawal.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{withdrawal.user_name}</p>
                              <p className="text-sm text-gray-500">{withdrawal.amount} XOF</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {new Date(withdrawal.created_at).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => handleWithdrawalAction(withdrawal)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Traiter
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-6 py-8 text-center text-gray-500">
                      Aucun retrait en attente
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === MES PRODUITS === */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <ProductList />
            </div>
          </div>
        )}

        {/* === CATÉGORIES === */}
        {activeTab === 'categories' && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <CategoryManager />
          </div>
        )}

        {/* === TAGS === */}
        {activeTab === 'tags' && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <TagSystem />
          </div>
        )}

        {/* === PARAMÈTRES === */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CONFIGURATION FEDAPAY */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Paiement</h3>
                <p className="text-sm text-gray-600 mb-4">Configurez les clés API Fedapay pour activer les paiements.</p>
                <button 
                  onClick={() => setFedapayModal(true)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  🔑 Configurer Fedapay
                </button>
              </div>

              {/* COMMISSION */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Plateforme</h3>
                <p className="text-sm text-gray-600 mb-2">Taux actuel: <strong>{stats.commission_rate || 10}%</strong></p>
                <p className="text-sm text-gray-600 mb-4">Définissez le pourcentage de commission sur les ventes.</p>
                <button 
                  onClick={() => setCommissionModal(true)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  📊 Modifier Commission
                </button>
              </div>

  {/* PARAMÈTRES PLATEFORME */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres Généraux</h3>
                <p className="text-sm text-gray-600 mb-4">Configurez les paramètres généraux de la plateforme.</p>
                <button 
                  onClick={() => setPlatformSettingsModal(true)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  ⚙️ Paramètres Plateforme
                </button>
              </div>

              {/* RETRAIT ADMIN */}
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Retrait des Gains</h3>
                <p className="text-sm text-gray-600 mb-2">Solde disponible: <strong>{walletBalance} XOF</strong></p>
                <p className="text-sm text-gray-600 mb-4">Retirez vos gains (commissions + ventes personnelles).</p>
                <button 
                  onClick={() => setAdminEarningsModal(true)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  💰 Retrait Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* === MODALS === */}
      <ProductModal 
        isOpen={productModal.isOpen} 
        onClose={() => setProductModal({ isOpen: false, product: null })} 
        onSave={saveProduct} 
        product={productModal.product} 
      />
      <FedapayConfigModal 
        isOpen={fedapayModal} 
        onClose={() => setFedapayModal(false)} 
        onSave={saveFedapayKeys} 
        currentKeys={paymentProvider} 
      />
      <CommissionSettingsModal 
        isOpen={commissionModal} 
        onClose={() => setCommissionModal(false)} 
        currentRate={stats.commission_rate || 10} 
        onSave={saveCommission} 
      />
      <AdminEarningsWithdrawalModal
        isOpen={adminEarningsModal}
        onClose={() => setAdminEarningsModal(false)}
        adminBalance={walletBalance}
        onWithdrawalSuccess={fetchInitialData}
      />
      <AdminWithdrawalModal
        isOpen={adminWithdrawalModal}
        onClose={() => {
          setAdminWithdrawalModal(false);
          setSelectedWithdrawal(null);
        }}
        withdrawal={selectedWithdrawal}
        onActionSuccess={handleWithdrawalSuccess}
      />
      <InfoModal 
        isOpen={infoModal.isOpen} 
        onClose={() => setInfoModal({ isOpen: false, title: '', message: '' })} 
        title={infoModal.title} 
        message={infoModal.message} 
      />
      <ErrorModal 
        isOpen={errorModal.isOpen} 
        onClose={() => setErrorModal({ isOpen: false, title: '', message: '' })} 
        title={errorModal.title} 
        message={errorModal.message} 
      />
      <WithdrawalModal 
        isOpen={withdrawalModal} 
        onClose={() => setWithdrawalModal(false)} 
        walletBalance={walletBalance} 
      />
      <PlatformSettingsModal 
        isOpen={platformSettingsModal} 
        onClose={() => setPlatformSettingsModal(false)} 
      />
      <TransactionDetailsModal 
        isOpen={transactionModal.isOpen} 
        onClose={() => setTransactionModal({ isOpen: false, transactionId: null })} 
        transactionId={transactionModal.transactionId} 
      />
      <DeleteConfirmModal 
        isOpen={deleteConfirm.isOpen} 
        onClose={() => setDeleteConfirm({ isOpen: false, message: '', onConfirm: null })} 
        onConfirm={deleteConfirm.onConfirm} 
        message={deleteConfirm.message} 
      />
      <ServiceModal 
        isOpen={serviceModal.isOpen} 
        onClose={() => setServiceModal({ isOpen: false, service: null })} 
        onSave={fetchInitialData} 
        service={serviceModal.service} 
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;