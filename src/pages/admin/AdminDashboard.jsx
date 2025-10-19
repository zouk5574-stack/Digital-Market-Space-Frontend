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
  const [showFedapayModal, setShowFedapayModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  
  // Hooks pour les données
  const { actions: adminActions, states: adminStates } = useAdminApi();
  const { actions: statsActions, states: statsStates } = useStatsApi();
  const { actions: walletActions, states: walletStates } = useWalletApi();
  const { actions: productActions, states: productStates } = useProductsApi();
  const { actions: withdrawalActions, states: withdrawalStates } = useWithdrawalsApi();
  const { actions: paymentActions, states: paymentStates } = usePaymentProvidersApi();
  const { actions: fedapayActions, states: fedapayStates } = useFedapayApi();

  // Chargement initial des données
  useEffect(() => {
    statsActions.getAdminStats();
    adminActions.listUsers();
    adminActions.listWithdrawals();
    walletActions.getBalance();
    productActions.getMyProducts();
    paymentActions.getActiveProvider();
  }, []);

  // Gestion des retraits utilisateurs
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

  // Gestion statut utilisateur
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminActions.toggleUserStatus(userId, !currentStatus);
      adminActions.listUsers();
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  // Configuration Fedapay
  const handleSaveFedapayKeys = async (keys) => {
    try {
      await fedapayActions.setKeys(keys);
      setShowFedapayModal(false);
      paymentActions.getActiveProvider(); // Recharger les infos
    } catch (error) {
      console.error('Erreur sauvegarde clés Fedapay:', error);
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

  // Calcul des revenus totaux de l'admin (commissions + ventes produits)
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
              <p className="mt-1 text-sm text-gray-500">
                Gestion complète de la plateforme Digital Market Space
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="primary"
                onClick={() => setShowWithdrawalModal(true)}
                disabled={walletBalance <= 0}
              >
                Demander un Retrait
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowProductModal(true)}
              >
                + Ajouter Produit
              </Button>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Vue Générale' },
                { id: 'users', name: 'Utilisateurs' },
                { id: 'withdrawals', name: 'Retraits' },
                { id: 'products', name: 'Mes Produits' },
                { id: 'settings', name: 'Paramètres' },
                { id: 'logs', name: 'Logs Système' },
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
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatsCard
                title="Utilisateurs Total"
                value={stats.users}
                icon="👥"
                color="blue"
                description="Nombre total d'utilisateurs inscrits"
              />
              <StatsCard
                title="Produits Plateforme"
                value={stats.products}
                icon="📦"
                color="green"
                description="Total produits vendus sur la plateforme"
              />
              <StatsCard
                title="Revenue Brut Total"
                value={`${stats.totalGrossRevenue?.toFixed(2) || '0'} XOF`}
                icon="💰"
                color="purple"
                description="Chiffre d'affaires total de la plateforme"
              />
              <StatsCard
                title="Commissions Plateforme"
                value={`${stats.totalNetCommission?.toFixed(2) || '0'} XOF`}
                icon="🏢"
                color="orange"
                description="Revenus de commission de la plateforme"
              />
              <StatsCard
                title="Retraits en Attente"
                value={stats.pendingWithdrawals}
                icon="⏳"
                color="yellow"
                description="Demandes de retrait à traiter"
              />
              <StatsCard
                title="Litiges Ouverts"
                value={stats.openDisputes}
                icon="⚡"
                color="red"
                description="Litiges en cours de résolution"
              />
              <StatsCard
                title="Mon Solde Total"
                value={`${walletBalance} XOF`}
                icon="💳"
                color="indigo"
                description={`Commissions: ${stats.totalNetCommission?.toFixed(2) || '0'} XOF + Ventes: ${(totalAdminRevenue - (stats.totalNetCommission || 0)).toFixed(2)} XOF`}
              />
              <StatsCard
                title="Mes Produits"
                value={products.length}
                icon="🛍️"
                color="pink"
                description="Mes produits digitaux en vente"
              />
            </div>

            {/* Répartition des revenus */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition de Mes Revenus</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalNetCommission?.toFixed(2) || '0'} XOF
                  </div>
                  <div className="text-sm text-blue-800">Commissions Plateforme</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(totalAdminRevenue - (stats.totalNetCommission || 0)).toFixed(2)} XOF
                  </div>
                  <div className="text-sm text-green-800">Ventes Mes Produits</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {totalAdminRevenue.toFixed(2)} XOF
                  </div>
                  <div className="text-sm text-purple-800">Revenus Totaux</div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="secondary" onClick={() => setActiveTab('users')}>
                  Gérer Utilisateurs
                </Button>
                <Button variant="secondary" onClick={() => setActiveTab('withdrawals')}>
                  Valider Retraits
                </Button>
                <Button variant="secondary" onClick={() => setShowProductModal(true)}>
                  Vendre Produit
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowWithdrawalModal(true)}
                  disabled={walletBalance <= 0}
                >
                  Retrait Fonds
                </Button>
                <Button variant="secondary" onClick={() => setShowFedapayModal(true)}>
                  Config Fedapay
                </Button>
                <Button variant="secondary" onClick={() => setShowCommissionModal(true)}>
                  Commission
                </Button>
              </div>
            </div>

            {/* Statut du provider de paiement */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Fedapay</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Clé Publique</h4>
                  <div className="bg-gray-50 p-3 rounded border">
                    {paymentProvider.public_key ? (
                      <code className="text-sm text-green-600 break-all">
                        {paymentProvider.public_key}
                      </code>
                    ) : (
                      <span className="text-red-500 text-sm">Non configurée</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Clé Secrète</h4>
                  <div className="bg-gray-50 p-3 rounded border">
                    {paymentProvider.secret_key ? (
                      <code className="text-sm text-orange-600 break-all">
                        {paymentProvider.secret_key.substring(0, 20)}...
                      </code>
                    ) : (
                      <span className="text-red-500 text-sm">Non configurée</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setShowFedapayModal(true)}>
                  {paymentProvider.public_key ? 'Modifier les Clés' : 'Configurer Fedapay'}
                </Button>
              </div>
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
                  { key: 'wallet_balance', label: 'Solde', format: (value) => `${value || 0} XOF` },
                  { 
                    key: 'is_active', 
                    label: 'Statut', 
                    format: (value) => (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {value ? 'Actif' : 'Bloqué'}
                      </span>
                    )
                  },
                ]}
                actions={[
                  {
                    label: (user) => user.is_active ? 'Bloquer' : 'Débloquer',
                    onClick: (user) => handleToggleUserStatus(user.id, user.is_active),
                    variant: (user) => user.is_active ? 'danger' : 'primary'
                  }
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
                  { key: 'amount', label: 'Montant', format: (value) => `${value} XOF` },
                  { key: 'created_at', label: 'Date Demande', format: (value) => new Date(value).toLocaleDateString() },
                ]}
                actions={[
                  {
                    label: 'Approuver',
                    onClick: (withdrawal) => handleApproveWithdrawal(withdrawal.id),
                    variant: 'primary'
                  },
                  {
                    label: 'Rejeter',
                    onClick: (withdrawal) => {
                      const reason = prompt('Raison du rejet:');
                      if (reason) handleRejectWithdrawal(withdrawal.id, reason);
                    },
                    variant: 'danger'
                  }
                ]}
                loading={adminStates.withdrawals.loading}
              />
            </div>
          </div>
        )}

        {/* Produits Admin */}
        {activeTab === 'products' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Mes Produits Digitaux ({products.length})</h3>
                <Button onClick={() => setShowProductModal(true)}>
                  + Nouveau Produit
                </Button>
              </div>
              <DataTable
                data={products}
                columns={[
                  { key: 'name', label: 'Nom' },
                  { key: 'description', label: 'Description' },
                  { key: 'price', label: 'Prix', format: (value) => `${value} XOF` },
                  { key: 'category', label: 'Catégorie' },
                  { 
                    key: 'created_at', 
                    label: 'Date Création', 
                    format: (value) => new Date(value).toLocaleDateString() 
                  },
                ]}
                actions={[
                  {
                    label: 'Modifier',
                    onClick: (product) => console.log('Modifier:', product),
                    variant: 'secondary'
                  },
                  {
                    label: 'Supprimer',
                    onClick: (product) => console.log('Supprimer:', product),
                    variant: 'danger'
                  }
                ]}
                loading={productStates.products.loading}
              />
            </div>
          </div>
        )}

        {/* Paramètres */}
        {activeTab === 'settings' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Fedapay */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Fedapay</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Statut: {paymentProvider.public_key ? '✓ Configuré' : '✗ Non configuré'}</p>
                    {paymentProvider.public_key && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">
                          <strong>Clé publique:</strong> {paymentProvider.public_key.substring(0, 25)}...
                        </p>
                        <p className="text-xs text-gray-500">
                          <strong>Clé secrète:</strong> {paymentProvider.secret_key ? '✓ Configurée' : '✗ Non configurée'}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button onClick={() => setShowFedapayModal(true)} fullWidth>
                    {paymentProvider.public_key ? 'Modifier les clés' : 'Configurer Fedapay'}
                  </Button>
                </div>
              </div>

              {/* Paramètres Commission */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres Commission</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Configurez le taux de commission de la plateforme (actuellement 10%)
                  </p>
                  <Button onClick={() => setShowCommissionModal(true)} fullWidth>
                    Modifier Commission
                  </Button>
                </div>
              </div>
