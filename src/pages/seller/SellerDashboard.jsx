// src/pages/seller/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useStatsApi, useProductsApi, useOrdersApi, useFreelanceApi, useWithdrawalsApi } from '../../hooks/useApi';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/dashboard/StatsCard';
import DataTable from '../../components/dashboard/DataTable';
import InfoModal from '../../components/ui/InfoModal';
import ErrorModal from '../../components/ui/ErrorModal';
import DeleteConfirmModal from '../../components/ui/DeleteConfirmModal';
import TransactionDetailsModal from '../../components/admin/TransactionDetailsModal';
import ServiceModal from '../../components/modals/ServiceModal';
import WithdrawalModal from '../../components/admin/WithdrawalModal';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Modals
  const [infoModal, setInfoModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, onConfirm: null });
  const [transactionModal, setTransactionModal] = useState({ open: false, transactionId: null });
  const [serviceModal, setServiceModal] = useState({ open: false, service: null });
  const [withdrawalModal, setWithdrawalModal] = useState({ open: false, walletBalance: 0 });

  // API Hooks
  const { actions: statsActions, states: statsStates } = useStatsApi();
  const { actions: productActions, states: productStates } = useProductsApi();
  const { actions: ordersActions, states: ordersStates } = useOrdersApi();
  const { actions: freelanceActions, states: freelanceStates } = useFreelanceApi();
  const { actions: withdrawalActions } = useWithdrawalsApi();

  // Chargement initial
  useEffect(() => {
    statsActions.getUserStats();
    productActions.getMyProducts();
    ordersActions.getMySales();
    freelanceActions.getMyApplications();
  }, []);

  const stats = statsStates.userStats.data?.stats || {};
  const products = productStates.products.data || [];
  const sales = ordersStates.sales.data || [];
  const applications = freelanceStates.applications.data || [];

  const pendingApplications = applications.filter(app => ['open', 'pending_payment'].includes(app.mission?.status));
  const activeMissions = applications.filter(app => app.mission?.status === 'in_progress');
  const completedMissions = applications.filter(app => ['completed', 'awaiting_validation'].includes(app.mission?.status));

  // Supprimer un produit
  const handleDeleteProduct = (product) => {
    setDeleteModal({
      open: true,
      item: product,
      onConfirm: async () => {
        try {
          await productActions.deleteProduct(product.id);
          productActions.getMyProducts();
          setDeleteModal({ open: false, item: null, onConfirm: null });
        } catch {
          setErrorModal({ open: true, message: 'Impossible de supprimer le produit.' });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Vendeur</h1>
            <p className="mt-1 text-sm text-gray-500">Gérez vos produits, ventes et missions freelance</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="primary" onClick={() => setServiceModal({ open: true, service: null })}>+ Nouveau Produit</Button>
            <Button variant="secondary" onClick={() => setInfoModal({ open: true, message: 'Section Missions bientôt disponible' })}>Voir Missions</Button>
            <Button
              variant="secondary"
              onClick={() => setWithdrawalModal({ open: true, walletBalance: stats.totalSellerEarnings || 0 })}
            >
              Demander Retrait
            </Button>
          </div>
        </div>

        {/* Navigation onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-4 sm:px-6 lg:px-8">
            {['overview', 'products', 'sales', 'missions', 'applications'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' ? 'Vue Générale' :
                 tab === 'products' ? 'Mes Produits' :
                 tab === 'sales' ? 'Mes Ventes' :
                 tab === 'missions' ? 'Missions Freelance' :
                 'Mes Candidatures'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Vue Générale */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard title="Produits Actifs" value={products.length} icon="📦" color="blue" />
            <StatsCard title="Ventes Total" value={stats.salesCount} icon="💰" color="green" />
            <StatsCard title="Gains Nets" value={`${stats.totalSellerEarnings || 0} XOF`} icon="🎯" color="purple" />
            <StatsCard title="Missions Actives" value={activeMissions.length} icon="⚡" color="orange" />
            <StatsCard title="Candidatures" value={applications.length} icon="📝" color="yellow" />
            <StatsCard title="Missions Terminées" value={completedMissions.length} icon="✅" color="green" />
          </div>
        )}

        {/* Mes Produits */}
        {activeTab === 'products' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Mes Produits ({products.length})</h3>
              <Button onClick={() => setServiceModal({ open: true, service: null })}>+ Nouveau Produit</Button>
            </div>
            <DataTable
              data={products}
              columns={[
                { key: 'name', label: 'Nom' },
                { key: 'description', label: 'Description' },
                { key: 'price', label: 'Prix', format: v => `${v} XOF` },
                { key: 'category', label: 'Catégorie' },
                { key: 'created_at', label: 'Date Création', format: v => new Date(v).toLocaleDateString() },
              ]}
              actions={[
                { label: 'Modifier', onClick: p => setServiceModal({ open: true, service: p }) },
                { label: 'Supprimer', onClick: handleDeleteProduct },
              ]}
              loading={productStates.products.loading}
            />
          </div>
        )}

        {/* Mes Candidatures */}
        {activeTab === 'applications' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Mes Candidatures ({applications.length})</h3>
            </div>
            <DataTable
              data={applications}
              columns={[
                { key: 'mission.title', label: 'Mission' },
                { key: 'proposed_price', label: 'Prix Proposé', format: v => `${v} XOF` },
                { key: 'mission.status', label: 'Statut Mission' },
                { key: 'created_at', label: 'Date Candidature', format: v => new Date(v).toLocaleDateString() },
              ]}
              actions={[
                { label: 'Voir Détails', onClick: a => setTransactionModal({ open: true, transactionId: a.id }) },
              ]}
              loading={freelanceStates.applications.loading}
            />
          </div>
        )}

        {/* Sections en développement */}
        {(activeTab === 'sales' || activeTab === 'missions') && (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">Section {activeTab} en cours de développement...</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <InfoModal isOpen={infoModal.open} onClose={() => setInfoModal({ open: false, message: '' })} message={infoModal.message} />
      <ErrorModal isOpen={errorModal.open} onClose={() => setErrorModal({ open: false, message: '' })} message={errorModal.message} />
      <DeleteConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, item: null, onConfirm: null })} onConfirm={deleteModal.onConfirm} item={deleteModal.item} />
      <TransactionDetailsModal isOpen={transactionModal.open} onClose={() => setTransactionModal({ open: false, transactionId: null })} transactionId={transactionModal.transactionId} />
      <ServiceModal isOpen={serviceModal.open} onClose={() => setServiceModal({ open: false, service: null })} service={serviceModal.service} />
      <WithdrawalModal
        isOpen={withdrawalModal.open}
        onClose={() => setWithdrawalModal({ open: false, walletBalance: 0 })}
        walletBalance={withdrawalModal.walletBalance}
      />
    </div>
  );
};

export default SellerDashboard;