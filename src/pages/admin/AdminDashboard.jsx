// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  useAdminApi, 
  useStatsApi, 
  useWalletApi, 
  useProductsApi, 
  useWithdrawalsApi,
  usePaymentProvidersApi,
  useFedapayApi 
} from '../../hooks/useApi';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import WithdrawalModal from '../../components/admin/WithdrawalModal';
import ProductModal from '../../components/admin/ProductModal';
import FedapayConfigModal from '../../components/admin/FedapayConfigModal';
import CommissionSettingsModal from '../../components/admin/CommissionSettingsModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFedapayModal, setShowFedapayModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);

  // Hooks API
  const { actions: adminActions, states: adminStates } = useAdminApi();
  const { actions: statsActions, states: statsStates } = useStatsApi();
  const { actions: walletActions, states: walletStates } = useWalletApi();
  const { actions: productActions, states: productStates } = useProductsApi();
  const { actions: withdrawalActions, states: withdrawalStates } = useWithdrawalsApi();
  const { actions: paymentActions, states: paymentStates } = usePaymentProvidersApi();
  const { actions: fedapayActions, states: fedapayStates } = useFedapayApi();

  // Chargement initial
  useEffect(() => {
    statsActions.getAdminStats();
    adminActions.listUsers();
    adminActions.listWithdrawals();
    walletActions.getBalance();
    productActions.getMyProducts();
    paymentActions.getActiveProvider();
  }, []);

  // ================= Gestion Utilisateurs =================
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminActions.toggleUserStatus(userId, !currentStatus);
      adminActions.listUsers();
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  // ================= Gestion Retraits =================
  const handleApproveWithdrawal = async (withdrawalId) => {
    try {
      await withdrawalActions.approveWithdrawal(withdrawalId);
      adminActions.listWithdrawals();
    } catch (error) {
      console.error('Erreur approbation retrait:', error);
    }
  };

  const handleRejectWithdrawal = async (withdrawalId, reason) => {
    try {
      await withdrawalActions.rejectWithdrawal(withdrawalId, reason);
      adminActions.listWithdrawals();
    } catch (error) {
      console.error('Erreur rejet retrait:', error);
    }
  };

  // ================= Gestion Produits =================
  const handleOpenProductModal = (product = null) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productActions.updateProduct(editingProduct.id, productData);
      } else {
        await productActions.createProduct(productData);
      }
      productActions.getMyProducts();
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erreur sauvegarde produit:', error);
      alert('Impossible de sauvegarder le produit.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      await productActions.deleteProduct(productId);
      productActions.getMyProducts();
    } catch (error) {
      console.error('Erreur suppression produit:', error);
      alert('Impossible de supprimer le produit.');
    }
  };

  // ================= Configuration Fedapay =================
  const handleSaveFedapayKeys = async (keys) => {
    try {
      await fedapayActions.setKeys(keys);
      setShowFedapayModal(false);
      paymentActions.getActiveProvider();
    } catch (error) {
      console.error('Erreur sauvegarde clés Fedapay:', error);
      alert('Impossible de sauvegarder les clés Fedapay.');
    }
  };

  // ================= Commission =================
  const handleSaveCommission = async (newRate) => {
    try {
      await adminActions.updateCommission(newRate);
      setShowCommissionModal(false);
      statsActions.getAdminStats();
    } catch (error) {
      console.error('Erreur sauvegarde commission:', error);
      alert('Impossible de sauvegarder la commission.');
    }
  };

  if (statsStates.adminStats.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  const stats = statsStates.adminStats.data?.stats || {};
  const users = adminStates.users.data || [];
  const withdrawals = adminStates.withdrawals.data || [];
  const walletBalance = walletStates.balance.data?.wallet?.balance || 0;
  const products = productStates.products.data || [];
  const paymentProvider = paymentStates.activeProvider.data?.provider || {};
  const totalAdminRevenue = (stats.totalNetCommission || 0) + 
    (products.reduce((sum, product) => sum + (product.price || 0), 0));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
              <p className="mt-1 text-sm text-gray-500">Gestion complète de la plateforme Digital Market Space</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="primary" onClick={() => setShowWithdrawalModal(true)} disabled={walletBalance <= 0}>
                Demander un Retrait
              </Button>
              <Button variant="secondary" onClick={() => handleOpenProductModal()}>
                + Ajouter Produit
              </Button>
            </div>
          </div>

          {/* Navigation onglets */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Vue Générale' },
                { id: 'users', name: 'Utilisateurs' },
                { id: 'withdrawals', name: 'Retraits' },
                { id: 'products', name: 'Mes Produits' },
                { id: 'settings', name: 'Paramètres' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
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
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Vue Générale */}
        {activeTab === 'overview' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatsCard title="Utilisateurs Total" value={stats.users} icon="👥" color="blue" description="Nombre total d'utilisateurs inscrits"/>
              <StatsCard title="Produits Plateforme" value={stats.products} icon="📦" color="green" description="Total produits vendus sur la plateforme"/>
              <StatsCard title="Revenue Brut Total" value={`${stats.totalGrossRevenue?.toFixed(2) || '0'} XOF`} icon="💰" color="purple" description="Chiffre d'affaires total de la plateforme"/>
              <StatsCard title="Commissions Plateforme" value={`${stats.totalNetCommission?.toFixed(2) || '0'} XOF`} icon="🏢" color="orange" description="Revenus de commission de la plateforme"/>
            </div>
          </div>
        )}

        {/* Gestion Utilisateurs */}
        {activeTab === 'users' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Gestion des Utilisateurs ({users.length})</h3>
              </div>
              <DataTable
                data={users}
                columns={[
                  { key: 'username', label: 'Username' },
                  { key: 'email', label: 'Email' },
                  { key: 'role', label: 'Rôle' },
                  { key: 'wallet_balance', label: 'Solde', format: (v) => `${v || 0} XOF` },
                  { key: 'is_active', label: 'Statut', format: (v) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      v ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>{v ? 'Actif' : 'Bloqué'}</span>
                  ) }
                ]}
                actions={[
                  { label: (user) => user.is_active ? 'Bloquer' : 'Débloquer', onClick: (u) => handleToggleUserStatus(u.id, u.is_active) }
                ]}
                loading={adminStates.users.loading}
              />
            </div>
          </div>
        )}

        {/* Gestion Retraits */}
        {activeTab === 'withdrawals' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Retraits en Attente ({withdrawals.filter(w => w.status === 'pending').length})
                </h3>
              </div>
              <DataTable
                data={withdrawals.filter(w => w.status === 'pending')}
                columns={[
                  { key: 'user.username', label: 'Utilisateur' },
                  { key: 'amount', label: 'Montant', format: (v) => `${v} XOF` },
                  { key: 'created_at', label: 'Date Demande', format: (v) => new Date(v).toLocaleDateString() },
                ]}
                actions={[
                  { label: 'Approuver', onClick: (w) => handleApproveWithdrawal(w.id) },
                  { label: 'Rejeter', onClick: (w) => {
                    const reason = prompt('Raison du rejet:');
                    if (reason) handleRejectWithdrawal(w.id, reason);
                  } }
                ]}
                loading={adminStates.withdrawals.loading}
              />
            </div>
          </div>
        )}

        {/* Gestion Produits */}
        {activeTab === 'products' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Mes Produits Digitaux ({products.length})</h3>
                <Button onClick={() => handleOpenProductModal()}>+ Nouveau Produit</Button>
              </div>
              <DataTable
                data={products}
                columns={[
                  { key: 'name', label: 'Nom' },
                  { key: 'description', label: 'Description' },
                  { key: 'price', label: 'Prix', format: (v) => `${v} XOF` },
                  { key: 'category', label: 'Catégorie' },
                  { key: 'created_at', label: 'Date Création', format: (v) => new Date(v).toLocaleDateString() }
                ]}
                actions={[
                  { label: 'Modifier', onClick: (p) => handleOpenProductModal(p) },
                  { label: 'Supprimer', onClick: (p) => handleDeleteProduct(p.id) }
                ]}
                loading={productStates.products.loading}
              />
            </div>
          </div>
        )}

        {/* Paramètres */}
        {activeTab === 'settings' && (
          <div className="px-4 py-6 sm:px-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Fedapay</h3>
              <p className="text-sm text-gray-600 mb-2">
                Statut: {paymentProvider.public_key ? '✓ Configuré' : '✗ Non configuré'}
              </p>
              <Button fullWidth onClick={() => setShowFedapayModal(true)}>
                {paymentProvider.public_key ? 'Modifier les clés' : 'Configurer Fedapay'}
              </Button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres Commission</h3>
              <p className="text-sm text-gray-600 mb-4">Taux actuel: {stats.commissionRate || 10}%</p>
              <Button fullWidth onClick={() => setShowCommissionModal(true)}>Modifier Commission</Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      <FedapayConfigModal
        isOpen={showFedapayModal}
        onClose={() => setShowFedapayModal(false)}
        onSave={handleSaveFedapayKeys}
        currentKeys={paymentProvider}
      />

      <CommissionSettingsModal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        currentRate={stats.commissionRate || 10}
        onSave={handleSaveCommission}
      />

      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        walletBalance={walletBalance}
      />
    </div>
  );
};

export default AdminDashboard;